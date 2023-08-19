import fs from "fs/promises";

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Certificate, User } from "@prisma/client";
import mime from "mime-types";
import { getServerSession } from "next-auth";
import PDFDocument from "pdfkit";
import QRcode from "qrcode";
import validator from "validator";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import authOptions from "lib/auth";
import { prisma } from "lib/prisma";
import ResponseDTO from "lib/response";
import path from "path";
import { PassThrough } from "stream";
import { CertContent } from "types/content";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.AWS_S3_ENDPOINT,
});

const replaceText = (text: string, user: User, cert: Certificate) => {
  return text
    .replace("{{Name}}", user.name)
    .replace("{{IssueDate}}", cert.issuedAt.toLocaleDateString("ko-KR"))
    .replace("{{PrintDate}}", new Date().toLocaleDateString("ko-KR"));
};

const toDocCoordinates = (x: number, y: number, orientation: string) => {
  if (orientation === "landscape") {
    // 1024 x 720 => 841.89 x 595.28
    return [(x * 841.89) / 1024, (y * 595.28) / 720];
  } else {
    // 720 x 1024 => 595.28 x 841.89
    return [(x * 595.28) / 720, (y * 841.89) / 1024];
  }
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return ResponseDTO.status(401).json({
      result: false,
      error: {
        title: "Unauthorized",
        message: "You are not authorized to perform this action",
      },
    });
  }

  const url = new URL(req.url);
  const pathParts = url.pathname.split("/");
  pathParts.pop(); // remove "issue"
  const id = pathParts.pop();

  if (!id || !validator.isUUID(id)) {
    return ResponseDTO.status(400).json({
      result: false,
      error: {
        title: "Bad Request",
        message: "Invalid request URL",
      },
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return ResponseDTO.status(403).json({
      result: false,
      error: {
        title: "Forbidden",
        message: "You are not authorized to perform this action",
      },
    });
  }

  const cert = await prisma.certificate.findUnique({
    where: {
      id,
    },
  });

  if (!cert) {
    return ResponseDTO.status(404).json({
      result: false,
      error: {
        title: "Not Found",
        message: "Certificate not found",
      },
    });
  }

  if (!cert.userIds.includes(user.id)) {
    return ResponseDTO.status(403).json({
      result: false,
      error: {
        title: "Forbidden",
        message: "You are not authorized to perform this action",
      },
    });
  }

  try {
    await fs.mkdir(path.join(__dirname, "data"));
  } catch {}

  try {
    const fontDir = path.resolve(process.cwd(), "node_modules/pdfkit/js/data");
    const fontList = await fs.readdir(fontDir);

    fontList.forEach(async (font) => {
      const fontFile = await fs.readFile(path.join(fontDir, font));
      const fontFilePath = path.resolve(__dirname, "data", font);

      await fs.writeFile(fontFilePath, fontFile);
    });
  } catch (e) {
    console.log(e);
  }

  const certLog = await prisma.certificateLog.create({
    data: {
      certificate: {
        connect: {
          id: cert.id,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  const content = JSON.parse(cert.content) as CertContent;

  const imageCommand = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `certs/images/${content.image.data}`,
  });

  const doc = new PDFDocument({
    size: "A4",
    layout: content.orientation,
  });

  try {
    const imageResponse = await s3.send(imageCommand);

    if (!imageResponse.Body) {
      return ResponseDTO.status(500).json({
        result: false,
        error: {
          title: "Internal Server Error",
          message: "Failed to fetch image from S3",
        },
      });
    }
    const imageBuffer = Buffer.from(
      await imageResponse.Body.transformToByteArray()
    );

    const imageURL = `data:${mime.contentType(
      content.image.data
    )};base64,${imageBuffer.toString("base64")}`;

    doc.image(imageURL, 0, 0, {
      align: "center",
      valign: "center",
      fit:
        content.orientation === "landscape"
          ? [841.89, 595.28]
          : [595.28, 841.89],
    });
  } catch (e) {
    console.log(e);
    return ResponseDTO.status(500).json({
      result: false,
      error: {
        title: "Internal Server Error",
        message: "Failed to fetch image from S3",
      },
    });
  }

  const qrcodeString = await QRcode.toDataURL(
    `${process.env.BASE_URL}/validate/${certLog.id}`,
    {
      width: 512,
    }
  );

  content.texts.forEach((text) => {
    const data = replaceText(text.data, user, cert);

    const [x, y] = toDocCoordinates(text.left, text.top, content.orientation);
    const [w, h] = toDocCoordinates(
      text.width,
      text.height,
      content.orientation
    );

    doc
      .font("data/ChosunGs.ttf", h)
      .text(data, x, y, {
        align: "center",
        width: w,
        height: h,
      })
      .rect(x, y, w, h);
  });

  content.rects.forEach(async (rect) => {
    doc.image(qrcodeString, rect.left - rect.width, rect.top - rect.height, {
      fit: [rect.width, rect.height],
    });
  });

  const pdfStream = new PassThrough();

  const getContent = new Promise<Uint8Array>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    pdfStream.on("data", (chunk) => chunks.push(chunk));
    pdfStream.on("end", () => resolve(Buffer.concat(chunks)));
    pdfStream.on("error", reject);
  });

  doc.pipe(pdfStream);
  doc.end();

  const contentBuffer = await getContent;

  const putCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `certs/issued/${certLog.id}.pdf`,
    Body: contentBuffer,
    ContentType: "application/pdf",
  });

  try {
    await s3.send(putCommand);
  } catch (e) {
    console.log(e);
    return ResponseDTO.status(500).json({
      result: false,
      error: {
        title: "Internal Server Error",
        message: "Failed to upload PDF to S3",
      },
    });
  }

  const getCommand = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `certs/issued/${certLog.id}.pdf`,
  });

  const preSigned = await getSignedUrl(s3, getCommand, {
    expiresIn: 1 * 60, // 1 minute
  });

  return ResponseDTO.status(200).json({
    result: true,
    data: {
      url: preSigned,
    },
  });
}

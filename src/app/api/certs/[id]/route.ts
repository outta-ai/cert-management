import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import validator from "validator";

import authOptions from "lib/auth";
import { prisma } from "lib/prisma";
import ResponseDTO from "lib/response";
import { CertContent } from "types/content";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.AWS_S3_ENDPOINT,
});

export async function DELETE(req: Request) {
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

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user || user.type !== "Admin") {
    return ResponseDTO.status(403).json({
      result: false,
      error: {
        title: "Forbidden",
        message: "You are not authorized to perform this action",
      },
    });
  }

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || !validator.isUUID(id)) {
    return ResponseDTO.status(400).json({
      result: false,
      error: {
        title: "Bad Request",
        message: "Invalid request body",
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

  await prisma.certificateLog.deleteMany({
    where: {
      certificateId: id,
    },
  });

  await prisma.certificate.delete({
    where: {
      id,
    },
  });

  const content = JSON.parse(cert.content) as CertContent;

  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `certs/images/${content.image.data}`,
    });

    await s3.send(deleteCommand);
  } catch (e) {
    console.log(e);
    return ResponseDTO.status(500).json({
      result: false,
      error: {
        title: "Internal Server Error",
        message: "An error occurred while deleting the certificate image",
      },
    });
  }

  return ResponseDTO.status(200).json({
    result: true,
  });
}

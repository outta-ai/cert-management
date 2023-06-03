import crypto from "crypto";

import mime from "mime-types";

import { dataURItoUint8Array } from "lib/dataURI";
import { prisma } from "lib/prisma";
import ResponseDTO from "lib/response";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import authOptions from "lib/auth";
import { getServerSession } from "next-auth";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.AWS_S3_ENDPOINT,
});

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

  const { name, content, issuedAt, users } = await req.json();

  if (!name || !content || !issuedAt || !users) {
    return ResponseDTO.status(400).json({
      result: false,
      error: {
        title: "Bad Request",
        message: "Invalid request body",
      },
    });
  }

  if (
    !Array.isArray(users) ||
    users.some((user: object) => typeof user !== "string")
  ) {
    return ResponseDTO.status(400).json({
      result: false,
      error: {
        title: "Bad Request",
        message: "Invalid request body",
      },
    });
  }

  const imageContent = content.image.data;

  const imageData = dataURItoUint8Array(imageContent);
  const extension = mime.extension(imageData.mime);
  const filename = `${crypto.randomUUID()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `certs/images/${filename}`,
    Body: imageData.data,
  });

  try {
    await s3.send(command);
  } catch (e) {
    console.log(e);

    return ResponseDTO.status(500).json({
      result: false,
      error: {
        title: "Internal Server Error",
        message: "Something went wrong while creating the certificate",
      },
    });
  }

  content.image.data = filename;

  const results = await prisma.certificate.create({
    data: {
      name,
      content: JSON.stringify(content),
      issuedAt: new Date(`${issuedAt}T00:00:00Z`),
      userIds: users as string[],
    },
  });

  if (results) {
    return ResponseDTO.status(201).json({
      result: true,
      data: results,
    });
  }

  return ResponseDTO.status(500).json({
    result: false,
    error: {
      title: "Internal Server Error",
      message: "Something went wrong while creating the certificate",
    },
  });
}

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
  const id = url.searchParams.get("id");

  if (!id) {
    return ResponseDTO.status(400).json({
      result: false,
      error: {
        title: "Bad Request",
        message: "Invalid request body",
      },
    });
  }

  await prisma.certificate.delete({
    where: {
      id,
    },
  });

  return ResponseDTO.status(200).json({
    result: true,
  });
}

import crypto from "crypto";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import mime from "mime-types";
import { getServerSession } from "next-auth";

import authOptions from "lib/auth";
import { dataURItoUint8Array } from "lib/dataURI";
import { prisma } from "lib/prisma";
import ResponseDTO from "lib/response";

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
    include: {
      groups: true,
    },
  });

  if (!user || !user.groups.find((g) => g.name === "Admin")) {
    return ResponseDTO.status(403).json({
      result: false,
      error: {
        title: "Forbidden",
        message: "You are not authorized to perform this action",
      },
    });
  }

  const { name, description, content, issuedAt, users } = await req.json();

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
      description,
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

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import mime from "mime-types";

import ResponseDTO from "lib/response";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.AWS_S3_ENDPOINT,
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || id.includes("/")) {
    return ResponseDTO.status(400).json({
      result: false,
      error: {
        title: "Bad Request",
        message: "Invalid request body",
      },
    });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `certs/images/${id}`,
    });

    const response = await s3.send(command);
    if (!response.Body) {
      console.log("Body not found");

      return ResponseDTO.status(404).json({
        result: false,
        error: {
          title: "Not Found",
          message: "Image not found",
        },
      });
    }

    const body = await response.Body.transformToByteArray();

    return new Response(body, {
      headers: {
        "Content-Type": mime.contentType(id) || "application/octet-stream",
      },
    });
  } catch (err) {
    console.log(err);

    return ResponseDTO.status(404).json({
      result: false,
      error: {
        title: "Not Found",
        message: "Image not found",
      },
    });
  }
}

import { auth } from "@clerk/nextjs";

import validator from "validator";

import { prisma } from "lib/prisma";
import ResponseDTO from "lib/response";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
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
      clerkId: userId,
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

  const { name, email, clerkId, type } = await req.json();

  if (
    !name ||
    !validator.isEmail(email) ||
    !["User", "Member", "Admin"].includes(type)
  ) {
    return ResponseDTO.status(400).json({
      result: false,
      error: {
        title: "Bad Request",
        message: "Invalid request body",
      },
    });
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      clerkId,
      type,
    },
  });

  return ResponseDTO.status(201).json({
    result: true,
    data: newUser,
  });
}

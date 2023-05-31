import { auth } from "@clerk/nextjs";

import { prisma } from "lib/prisma";
import ResponseDTO from "lib/response";

export async function POST(req: Request) {
  const { userId: reqUserId } = auth();

  if (!reqUserId) {
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
      clerkId: reqUserId,
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

  const userId = req.url.split("/").pop();

  const { memo, type } = await req.json();

  if (!["User", "Member", "Admin"].includes(type)) {
    return ResponseDTO.status(400).json({
      result: false,
      error: {
        title: "Bad Request",
        message: "Invalid request body",
      },
    });
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!targetUser) {
    return ResponseDTO.status(404).json({
      result: false,
      error: {
        title: "Not Found",
        message: "User not found",
      },
    });
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      memo,
      type,
    },
  });

  return ResponseDTO.status(201).json({
    result: true,
  });
}

export async function DELETE(req: Request) {
  const { userId: reqUserId } = auth();

  if (!reqUserId) {
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
      clerkId: reqUserId,
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

  const userId = req.url.split("/").pop();

  const targetUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!targetUser) {
    return ResponseDTO.status(404).json({
      result: false,
      error: {
        title: "Not Found",
        message: "User not found",
      },
    });
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return ResponseDTO.status(200).json({
    result: true,
  });
}

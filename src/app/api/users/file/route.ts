import { getServerSession } from "next-auth";

import { Group, User } from "@prisma/client";
import authOptions from "lib/auth";
import { prisma } from "lib/prisma";
import ResponseDTO from "lib/response";

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

  const content = await req.text();
  const lines = content.replaceAll("\r\n", "\n").split("\n");

  const header = ["이름", "이메일", "그룹", "Google ID", "메모"];
  const headers = lines[0].split(",");
  const hasHeader = headers.some((h) => header.includes(h));

  if (
    hasHeader &&
    !["이름", "이메일", "그룹"].every((must) => headers.includes(must))
  ) {
    return ResponseDTO.status(400).json({
      result: false,
      error: {
        title: "Bad Request",
        message: "필수 항목이 누락되었습니다",
      },
    });
  }

  try {
    const users: (User & { groups: Group[] })[] = [];

    for (const line of lines.slice(hasHeader ? 1 : 0)) {
      if (line.trim().length === 0) {
        continue;
      }

      const values = line.split(",");

      const user: Partial<User & { groups: Group[] }> = {};

      for (const [i, header] of headers.entries()) {
        if (header === "그룹") {
          if (!user.groups) {
            user.groups = [];
          }

          for (const g of values[i].split("|")) {
            const group = await prisma.group.findUnique({
              where: { id: g },
            });

            if (!group) {
              throw new Error("유저 타입이 올바르지 않습니다.");
            }

            user.groups.push(group);
          }
        } else if (header === "Google ID") {
          user.googleId = values[i].trim() ? values[i] : null;
        } else if (header === "이름") {
          user.name = values[i].trim();
        } else if (header === "이메일") {
          user.email = values[i].trim();
        } else if (header === "메모") {
          user.memo = values[i].trim();
        }
      }

      users.push(user as User & { groups: Group[] });
    }

    const result: Partial<User & { groups: Group[] }> & { result: boolean }[] =
      [];
    for (const user of users) {
      const resultUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          googleId: user.googleId,
          memo: user.memo,
          groups: {
            connect: user.groups?.map((g) => ({ id: g.id })),
          },
        },
      });

      result.push({
        result: !!resultUser.id,
        ...resultUser,
      });
    }

    return ResponseDTO.json({
      result: true,
      data: result,
    });
  } catch (e) {
    if (e instanceof Error) {
      return ResponseDTO.status(400).json({
        result: false,
        error: {
          title: "Bad Request",
          message: e.message,
        },
      });
    } else {
      return ResponseDTO.status(500).json({
        result: false,
        error: {
          title: "Internal Server Error",
          message: "알 수 없는 오류가 발생했습니다",
        },
      });
    }
  }
}

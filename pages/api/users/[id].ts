import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { id }: any = req.query;

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      posts: {
        select: {
          id: true,
          email: true,
          createdAt: true,
          text: true,
          postComments: {
            select: {
              id: true,
              createdAt: true,
              email: true,
              postsId: true,
              text: true,
              User: true,
            },
          },
        },
      },
    },
  });

  return res.status(201).json({ user });
}

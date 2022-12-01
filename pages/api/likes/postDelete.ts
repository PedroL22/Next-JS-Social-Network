import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { postsId } = req.body;

  await prisma.likes.delete({
    where: {
      postsId: postsId,
    },
  });

  return res.status(201).json({});
}

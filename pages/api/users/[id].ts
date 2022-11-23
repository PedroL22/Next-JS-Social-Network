import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { id }: any = req.query;

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return res.status(201).json({ user });
}

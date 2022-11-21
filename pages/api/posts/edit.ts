import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  const { text } = req.body;

  await prisma.posts.update({
    where: {
      email: email,
    },
    data: {
      text: text,
    },
  });

  return res.status(201).json({});
}

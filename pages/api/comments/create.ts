import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { postsId } = req.body
  const { text } = req.body
  const { email } = req.body

  await prisma.comments.create({
    data: {
      postsId,
      text,
      email,
    },
  })

  return res.status(201).json({})
}

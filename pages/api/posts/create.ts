import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { text } = req.body
  const { email } = req.body

  await prisma.posts.create({
    data: {
      text,
      email,
    },
  })

  return res.status(201).json({})
}

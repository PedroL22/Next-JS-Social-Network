import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body

  await prisma.likes.delete({
    where: {
      id: id,
    },
  })

  return res.status(201).json({})
}

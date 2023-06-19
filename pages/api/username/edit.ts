import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body
  const { name } = req.body

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      name: name,
    },
  })

  return res.status(201).json({})
}

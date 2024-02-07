import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "src/lib/prisma";
import { z } from 'zod'

export const getPoll = async (req: FastifyRequest, reply: FastifyReply) => {
  const getPollParams = z.object({
    pollId: z.string().uuid()
  })

  const { pollId } = getPollParams.parse(req.params)
  try {
    const pool = await prisma.poll.findUnique({
      where: {
        id: pollId
      },
      include: {
        options: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return reply.send({ pool })
  } catch (error) {
    console.error(error)
    throw error
  }
}
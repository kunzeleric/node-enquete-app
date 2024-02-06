import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "src/lib/prisma";
import { z } from 'zod'

export const createPoll = async (req: FastifyRequest, reply: FastifyReply) => {
  const createPollsBodySchema = z.object({
    title: z.string()
  })

  const { title } = createPollsBodySchema.parse(req.body)
  try {
    const pool = await prisma.poll.create({
      data: {
        title
      }
    })

    return reply.status(201).send({ poolId: pool.id })
  } catch (error) {
    console.error(error)
    throw error
  }
}
import { FastifyReply, FastifyRequest } from "fastify";
import { PollNotFoundError } from "src/errors/poll-not-found-error";
import { prisma } from "src/lib/prisma";
import { redis } from "src/lib/redis";
import { z } from 'zod'

export const getPoll = async (req: FastifyRequest, reply: FastifyReply) => {
  const getPollParams = z.object({
    pollId: z.string().uuid()
  })

  const { pollId } = getPollParams.parse(req.params)
  try {
    const poll = await prisma.poll.findUnique({
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

    if(!poll) {
      throw new PollNotFoundError()
    }

     // mapeando todas opções do poll (-1 é sintaxe para buscar todos)
    const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES')

    const votes = result.reduce((obj, line, index) => {
      if (index % 2 === 0){
        const score = result[index + 1]

        Object.assign(obj, { [line]: Number(score) })
      }

      return obj
    }, {} as Record<string, number>)

    return reply.send({ 
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map((option) => {
          return {
            id: option.id,
            title: option.title,
            score: (option.id in votes) ? votes[option.id] : 0
          }
        }),
      } })
  } catch (error) {
    console.error(error)
    throw error
  }
}
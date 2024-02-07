import { randomUUID } from "node:crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "src/lib/prisma";
import { z } from 'zod'
import { UserAlreadyVotedError } from "src/errors/user-already-voted-error";

export const voteOnPoll = async (req: FastifyRequest, reply: FastifyReply) => {
  const voteOnPollBody = z.object({
    pollOptionId: z.string().uuid(),
  })

  const voteOnPollParams = z.object({
    pollId: z.string().uuid(),
  })

  const { pollOptionId } = voteOnPollBody.parse(req.body)
  const { pollId } = voteOnPollParams.parse(req.params)
  try {
    let { sessionId } = req.cookies

    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId
          }
        }
      })

      if (userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {

        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id
          }
        })
      } else if (userPreviousVoteOnPoll) {
        throw new UserAlreadyVotedError()
      }
    }

    if (!sessionId) {
      sessionId = randomUUID()

      return reply.setCookie('sessionId', sessionId, {
        path: '/',
        httpOnly: true,
        signed: true, // deixa o cookie com uma assinatura unica do backend
        maxAge: 60 * 60 * 24 * 30 // 30 days
      }).send({ sessionId })
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId
      }
    })

    return reply.status(201).send()
  } catch (error) {
    console.error(error)
    throw error
  }
}
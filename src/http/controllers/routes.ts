import { FastifyInstance } from "fastify";
import { createPoll } from "./create-poll";
import { getPoll } from "./get-poll";
import { voteOnPoll } from "./vote-on-poll";

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/polls', createPoll)
  app.get('/polls/:pollId', getPoll)
  app.post('/polls/:pollId/vote', voteOnPoll)
}
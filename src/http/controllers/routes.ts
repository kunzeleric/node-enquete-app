import { FastifyInstance } from "fastify";
import { createPoll } from "./create-polls";

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/polls', createPoll)
}
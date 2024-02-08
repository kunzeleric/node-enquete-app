import fastify from 'fastify'
import cookie from '@fastify/cookie'
import websocket from '@fastify/websocket'
import { ZodError } from 'zod'
import { env } from 'src/env'
import { appRoutes } from './routes'
import { UserAlreadyVotedError } from 'src/errors/user-already-voted-error'
import { pollResults } from './ws/poll-results'


const app = fastify()

app.register(cookie, {
  secret: env.SECRET_COOKIE,
  hook: 'onRequest',
})

app.register(websocket)

app.register(appRoutes)
app.register(pollResults)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: "Validation Error", error: error.message })
  }

  if(error instanceof UserAlreadyVotedError) {
    return reply.status(500).send({ message: error.message })
  }

  return reply.status(500).send({ message: "Internal Server Error" })
})

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP server running!')
})
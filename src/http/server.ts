import fastify from 'fastify'
import { ZodError } from 'zod'
import cookie from '@fastify/cookie'
import { env } from 'src/env'
import { appRoutes } from './controllers/routes'
import { UserAlreadyVotedError } from 'src/errors/user-already-voted-error'


const app = fastify()

app.register(cookie, {
  secret: env.SECRET_COOKIE,
  hook: 'onRequest',
})

app.register(appRoutes)

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
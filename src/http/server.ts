import fastify from 'fastify'
import { env } from 'src/env'
import { appRoutes } from './controllers/routes'
import { ZodError } from 'zod'

const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: "Validation Error", error: error.message })
  }

  return reply.status(500).send({ message: "Internal Server Error" })
})

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP server running!')
})
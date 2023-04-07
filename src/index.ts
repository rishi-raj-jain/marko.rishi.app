import express from 'express'
import compressionMiddleware from 'compression'
import { routerMiddleware } from '@marko/run-adapter-node/middleware'

const { NODE_ENV = 'development', PORT = 3000 } = process.env

express()
  .use(compressionMiddleware())
  .use('/assets', express.static('assets'))
  .use(routerMiddleware())
  .listen(PORT, () => {
    console.log(`Env: ${NODE_ENV}`)
    console.log(`Address: http://localhost:${PORT}`)
  })

import express, { json } from 'express'
import { moviesRouter } from '../routes/movies.js'
import { corsMiddleware } from '../middlewares/cors.js'

const app = express()
const port = process.env.PORT ?? 12345
app.disable('x-powered-by')

app.use(json())
app.use(corsMiddleware())

app.use('/movies', moviesRouter)

app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`)
})
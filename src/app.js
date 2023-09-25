const express = require('express')
const moviesJSON = require('../movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('../Schemas/movieSchema')
const app = express()
const cors = require('cors')
const port = process.env.PORT ?? 12345

app.disable('x-powered-by')
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://127.0.0.1:5500',
      'http://localhost:12345'
    ]

    if(ACCEPTED_ORIGINS.includes(origin)){
      return callback(null, true)
    }

    if(!origin){
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}
))
app.use(express.json())



app.get ('/movies', (req, res) =>{
  const { genre } = req.query

  if(genre){
    const filteredMovies = moviesJSON.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()) //no keysensitive
    )
    return res.json(filteredMovies)
  }

  res.json(moviesJSON)
})

app.get ('/movies/:id', (req, res) =>{
  const { id } = req.params
  const movie = moviesJSON.find(movie => movie.id ===id)
  if(movie) return res.json(movie)

  res.status(404).json({message:'Movie not found'})
})

app.get ('/movies', (req, res) =>{
  res.json(moviesJSON)
})

app.post('/movies', (req, res) =>{
  const result = validateMovie(req.body)

  // result.success
  if(result.error){
    return res.status(400).json({error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  //Esto no seria Rest, porque estamos guardando el estado de app en memoria y no en una databs
  moviesJSON.push(newMovie)

  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if(!result.success){
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = moviesJSON.findIndex(movie => movie.id === id )
  
  if (movieIndex === -1)  return res.status(404).json({ message: 'Movie not found' })

  const updateMovie = {
    ...moviesJSON[movieIndex],
    ...result.data
  }

  moviesJSON[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = moviesJSON.findIndex(movie => movie.id === id)

  if(movieIndex === -1){
    return res.status(404).json({ message: 'movie not found' })
  }

  moviesJSON.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})


app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`)
})
import cors from 'cors'

export const corsMiddleware = () => cors ({
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
)
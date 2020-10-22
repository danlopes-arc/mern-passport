import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'

import passportConfig from './config/passport.js'
import apiRoute from './routes/api/index.js'

dotenv.config()

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('[mongo] connected'))
  .catch(err => console.error(err))

const app = express()

// app.use(express.urlencoded())
app.use(express.json())
app.use(passport.initialize())
passportConfig(passport)

app.use('/api', apiRoute)

app.get('/', (req, res) => {
  res.send('Hey')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`[server] listening to https://localhost:${port}`)
})
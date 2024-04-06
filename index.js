require('dotenv').config()
const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const { blogsRouter } = require('./controllers/blogs')
const { errorHandler } = require('./controllers/blogs')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorRouter = require('./controllers/authors')

app.use(express.json())

app.use('/', blogsRouter)
app.use('/', usersRouter)
app.use('/', loginRouter)
app.use('/', authorRouter)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
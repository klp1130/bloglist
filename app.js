const express = require('express')
const app = express()

const blogsRouter = require('./controllers/blogs')
app.use('/api/blogs', blogsRouter)
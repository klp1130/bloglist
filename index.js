
//const app = require('./app')
const config = require('./utils/config')
const http = require('http')
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

const server = http.createServer(app)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb+srv://fullstack:cattle4390equal@cluster0.l3wi6dm.mongodb.net/bloglist?retryWrites=true&w=majority'
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})
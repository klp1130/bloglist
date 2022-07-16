const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')


const verify = (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!request.token || !decodedToken.id) {
        response.status(401).json({ error: 'token missing or invalid' })
    }
    return decodedToken
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
})


blogsRouter.post('/', async (request, response) => {
    const decodedToken = verify(request, response)
    const user = await User .findById(decodedToken.id)
    const body = request.body

    if (!request.body.url || !request.body.title) {
        return response.status(400).json({
            error: 'missing content'
        })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    verify(request, response)

    const user = await User.findById(request.params.id)
    const blog = await Blog.findById(request.params.id)

    if ( blog.user.toString() === user.id.toString) {
        await Blog.findByIdAndRemove(request.params.id)
        return response(201).end
    } else {
        return response.status(403).json({ error: 'only the creator can delete blogs' })
    }

})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        comments: body.comments,    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())

})

module.exports = blogsRouter
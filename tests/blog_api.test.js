const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

/* initializing the database before every
 test with the beforeEach function */

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)

test('blog has property id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('POST request creates new blog post', async () => {
    const newBlog = {
        title: 'blogtastic',
        author: 'Michael Zhan',
        url: 'https://reactpatterns.com/',
        likes: 1,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.post('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length+1)
})


afterAll(() => {
    mongoose.connection.close()
})
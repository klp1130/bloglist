const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
]

/* initializing the database before every
 test with the beforeEach function */

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
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
        _id: 'async/await blog',
        title: 'blogtastic',
        author: 'Michael Zhan',
        url: 'https://reactpatterns.com/',
        likes: 1,
        __v: 0
    }

    await api
        .post
        .send(newBlog)
        .expect(400)

    const response = await api.post('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})


afterAll(() => {
    mongoose.connection.close()
})
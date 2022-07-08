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

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)
    // test for if new blog added has same as used in test
    const contents = blogsAtEnd.map(n => n.author)
    expect(contents).toContain('Michael Zhan')
})

//test that verifies that if the likes property is missing from
//the request, it will default to the value 0.
test('if likes undefined, set to 0', async () => {
    const newBlog = {
        title: 'blogtastic',
        author: 'Michael Zhan',
        url: 'https://reactpatterns.com/',
    }

    const checkBlog = {
        title: 'blogtastic',
        author: 'Michael Zhan',
        url: 'https://reactpatterns.com/',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const result = response.body[response.body.length - 1]
    expect(result.likes).toEqual(checkBlog.likes)
})

/* write a test related to creating new blogs (post:api/blogs) endpoint, that
verifies that if title and URL properties are missing from the request data, the backend
responds with status code 400 bad request*/

test('if title is missing return 400', async () => {
    const newBlog = {
        author: 'Michael Zhan',
        url: 'https://reactpatterns.com/',
        likes: 2
    }

    const checkBlog = {
        title: 'blogtastic',
        author: 'Michael Zhan',
        url: 'https://reactpatterns.com/',
        likes: 2
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/jason/)

    const response = await api.get('/api/blogs')
    expect(response).toThrow('400 Bad Request')


})

test('if URL is missing return 400', async () => {
    const newBlog = {
        title: 'blogtastic',
        author: 'Michael Zhan',
        likes: 2
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/jason/)

    const response = await api.get('/api/blogs')
    expect(response).toThrow('400 Bad Request')
})



afterAll(() => {
    mongoose.connection.close()
})
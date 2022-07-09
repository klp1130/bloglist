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

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)


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

})

/* deleting a single blog resource */
describe('deletion of a blog', () => {
    test('succeeds with status 204 if id is valid', async () => {
        const blogAtStart = await helper.blogsInDb()
        const blogToDelete = blogAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204) //no content: a request has succeeded, but no need to navigate away from current page

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const contents = blogsAtEnd.map(r => r.title)

        expect(contents).not.toContain(blogToDelete.title)
    })
})

/* update a single blog */
describe('updated a single blog', () => {
    test('succeeds in updating likes', async () => {
        const newBlog = {
            title: 'Masterpiece',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200) // successful response

        const allBlogs = await helper.blogsInDb()
        const blogToUpdate = allBlogs.find(blog => blog.title === newBlog.title)

        const updatedBlog = {
            ...blogToUpdate,
            likes: blogToUpdate.likes +1
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length +1)
        const foundBlog = blogsAtEnd.find(blog => blog.likes === 13)
        expect(foundBlog.likes).toBe(13)

    })
})

afterAll(() => {
    mongoose.connection.close()
})
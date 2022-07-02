//Helper functions go here

const blog = require("../models/blog")
const _ = require('lodash')


const dummy = (blogs) => {
    //..
    return 1
}

const totalLikes = (blogs) => {
    return (blogs.reduce((sum, blog) => {
        sum = sum + blog.likes
        return sum
    }, 0)
    )
}

const favoriteBlog = (blogs) => {
    const likes = blogs.map(b => b.likes)
    const blog = blogs[likes.indexOf(Math.max(...likes))]

    return blog

}
/* returns the author who has the largest amount of blogs. it also contains
the number of blogs the top author has */

const mostBlogs = (blogs) => {
    const bMap = _.countBy(blogs, (blog) => blog.author)
    const authorBlogCount = _.keys(bMap).map(author => {
        return {
            author,
            blogs: bMap[author]
        }
    })
    return authorBlogCount.reduce((pv, cv) => pv.count > cv.count ? pv : cv, {})
}

const mostLikes = (blogs) => {
    let blog = _.orderBy(blogs, ['likes'], ['des'])[0]
    return ({ author: blog.author, likes: blog.likes })
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}


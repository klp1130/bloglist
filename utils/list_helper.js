//Helper functions go here

const blog = require("../models/blog")

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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}


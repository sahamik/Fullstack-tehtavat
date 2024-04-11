const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const likes = blogs.reduce((total, blog) => total + blog.likes, 0)
    return likes 
}

const favoriteBlog = (blogs) => {
    let favorite = blogs[0]
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > favorite.likes) {
            favorite = blogs[i]
        }
    }
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    const blogCount = {}

    blogs.forEach((blog) => {
        if (blog.author in blogCount) {
            blogCount[blog.author]++
        } else {
            blogCount[blog.author] = 1
        }
    });

    let mostBlogsAuthor = Object.keys(blogCount)[0]
    let mostBlogsCount = blogCount[mostBlogsAuthor]

    for (const author in blogCount) {
        if (blogCount[author] > mostBlogsCount) {
            mostBlogsAuthor = author
            mostBlogsCount = blogCount[author]
        }
    }
    return {
        author: mostBlogsAuthor,
        blogs: mostBlogsCount
    }
}

const mostLikes = (blogs) => {
    const likeCount = {}

    blogs.forEach((blog) => {
        if (blog.author in likeCount) {
            likeCount[blog.author] += blog.likes
        } else {
            likeCount[blog.author] = blog.likes
        }
    });

    let mostLikesAuthor = Object.keys(likeCount)[0]
    let mostLikesCount = likeCount[mostLikesAuthor]

    for (const author in likeCount) {
        if (likeCount[author] > mostLikesCount) {
            mostLikesAuthor = author
            mostLikesCount = likeCount[author]
        }
    }
    return {
        author: mostLikesAuthor,
        blogs: mostLikesCount
    }
}
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }
const Blog = require('../models/blog')

const initialBlogs = [
    {
      title: "Jääkiekko",
      author: "Keijo Kiekkoilija",
      url: "https://www.example.com",
      likes: 0
    },
    {
      title: "Jalkapallo",
      author: "Jarkko Jalkapalloilija",
      url: "https://www.example.com",
      likes: 0
    },
  ]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog=> blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}
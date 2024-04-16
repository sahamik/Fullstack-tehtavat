const { test, after, beforeEach } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are three blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blogs have id field', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog=> {
    assert(blog.hasOwnProperty('id'))
  });
})

test('new blog can be added ', async () => {
  const newBlog = {
    title: 'Testausblogi',
    author: 'Teijo Testaaja',
    url: 'https://example.com',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(blog => blog.title)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

  assert(titles.includes('Testausblogi'))
})

test('blog without likes will be set to 0', async () => {
  const newBlog = {
    title: 'Tyhjä',
    author: 'Tuntematon',
    url: 'https://example.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const addedBlog = response.body.find(blog => blog.title === 'Tyhjä')

  assert.strictEqual(addedBlog.likes, 0)
})

test('blog without title', async () => {
  const newBlog = {
    author: 'Kimmo koodaaja',
    url: 'https://example.com',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('blog without url', async () => {
  const newBlog = {
    title: 'Koodaus',
    author: 'Kimmo koodaaja',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(!titles.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    title: 'Uusi nimi',
    author: 'Uusi kirjoittaja',
    url: 'https://newexample.com',
    likes: 0
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()

  const updatedBlogs = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
  assert.strictEqual(updatedBlogs.title, updatedBlog.title)
  assert.strictEqual(updatedBlogs.author, updatedBlog.author)
  assert.strictEqual(updatedBlogs.url, updatedBlog.url)
  assert.strictEqual(updatedBlogs.likes, updatedBlog.likes)
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

after(async () => {
  await mongoose.connection.close()
})
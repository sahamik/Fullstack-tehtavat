import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const newBlog = { title, author, url }
    createBlog(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Add new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Title:
          <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          URL:
          <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default BlogForm
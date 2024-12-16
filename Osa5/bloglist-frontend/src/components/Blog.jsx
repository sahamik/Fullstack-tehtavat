import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete }) => {
  const blogStyle = {
    width: '50%',
    backgroundColor: '#f4f4f4',
    border: '1px solid #000000',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '2px 2px 2px 2px #ddd',
  }

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <h3>{blog.title}</h3>
      <button onClick={toggleVisibility}>
        {visible ? 'Hide' : 'View'}
      </button>
      {visible && (
        <div>
          <p>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
          <p>Likes: {blog.likes} <button onClick={() => handleLike(blog.id)}>Like</button></p>
          <p> {blog.author}</p>
          <button onClick={() => handleDelete(blog.id)}>Delete</button>
        </div>
      )}
    </div>
  )
}

export default Blog
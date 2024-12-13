import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import './services/app.css'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const[errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)
  const noteFormRef = useRef();

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => {
        const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      }) 
    } 
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      setUser(user)
      if (user) {
        blogService.setToken(user.token)
      }
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('Logging in with', username)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem( 'loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    console.log('logged out')
    setUser(null)
    setBlogs([])
  }

    const createBlog = (newBlog) => {
    noteFormRef.current.toggleVisibility()
    blogService
      .create(newBlog)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setSuccessMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added!`)
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)
      })
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>Log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>Cancel</button>
        </div>
      </div>
    )
  }

  const handleLike = async (id, currentLikes) => {
    try {
      const blogToUpdate = blogs.find(blog => blog.id === id)
      const updatedBlog = {
        ...blogToUpdate,
        likes: currentLikes ?? blogToUpdate.likes + 1,
        user: blogToUpdate.user.id || blogToUpdate.user,
      }
      await blogService.update(id, updatedBlog)
      setBlogs(
        blogs
          .map(blog => (blog.id !== id ? blog : updatedBlog))
          .sort((a, b) => b.likes - a.likes)
      )
    } catch (error) {
      console.error('Error updating blog like:', error)
    }
  }

  const handleDelete = async (id) => {
    const blogToDelete = blogs.find(blog => blog.id === id)

    if (window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        setSuccessMessage(`Blog ${blogToDelete.title} by ${blogToDelete.author} removed!`)
        setTimeout(() => { setSuccessMessage('') }, 5000)
      } catch (error) {
        setErrorMessage('Error removing blog')
        setTimeout(() => { setErrorMessage('') }, 5000)
      }
    }
  }

  return (
    <div>
      <h2>Blogs</h2>

      {successMessage && <Notification message={successMessage} type="success" />}
      {errorMessage && <Notification message={errorMessage} type="error" />}

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>

          <Togglable buttonLabel="Create new blog" ref={noteFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>

          <ul>
            {blogs.map(blog => (
              <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete}/>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
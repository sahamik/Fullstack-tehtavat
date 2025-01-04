import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'


test('<BlogForm /> calls createBlog with right details', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('Write title here')
  const authorInput = screen.getByPlaceholderText('Write author here')
  const urlInput = screen.getByPlaceholderText('Write URL here')
  const submitButton = screen.getByText('Create')

  await user.type(titleInput, 'Test blog title')
  await user.type(authorInput, 'Test blog author')
  await user.type(urlInput, 'http://example.com')
  await user.click(submitButton)

  console.log(createBlog.mock.calls)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Test blog title')
  expect(createBlog.mock.calls[0][0].author).toBe('Test blog author')
  expect(createBlog.mock.calls[0][0].url).toBe('http://example.com')
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'
import Blog from './Blog'


test('renders blog title', () => {
  const blog = {
    title: 'Testing React components with Testing Library',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Testing React components with Testing Library')
  expect(element).toBeDefined()
})

test('renders title, url, likes, and author when View is clicked', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
    id: 1
  }

  render(<Blog blog={blog} />)

  const viewButton = screen.getByText('View')
  userEvent.click(viewButton)

  const urlElement = await screen.findByRole('link', { name: /example\.com/i })
  expect(urlElement).toBeInTheDocument()

  const likesElement = await screen.findByText('Likes: 5')
  expect(likesElement).toBeInTheDocument()

  const authorElement = await screen.findByText('Test Author')
  expect(authorElement).toBeInTheDocument()
})

test('if like button is clicked twice, calls the event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
    id: 1
  }
  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler} />)

  const viewButton = screen.getByText('View')
  await userEvent.click(viewButton)

  const likeButton = await screen.findByText('Like')
  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})

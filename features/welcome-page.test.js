import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import App from '../src/App'
import { rss } from './mocks/rss.xml'

// dependencies: localStorage

describe('Welcome Page', () => {
  const server = setupServer(
    rest.get('http://localhost:8080/http://feed.rss', (req, res, ctx) => {
      return res(ctx.xml(rss))
    }),
    rest.get('http://localhost:8080/https://blog.bitsapien.dev/notes/talks/testing-matters/', (req, res, ctx) => {
      return res(ctx.xml('<html></html>'))
    }),
    rest.get('http://localhost:8080/https://blog.bitsapien.dev/notes/shorts/oauth-20/', (req, res, ctx) => {
      return res(ctx.xml('<html></html>'))
    })
  )

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('given there is no feed sources then it must show the welcome page with the correct text and action buttons', () => {
    render(<App />)

    expect(screen.getByText('You have no feed sources, add one using the button below to start or import. 🚀')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Add Feed/i })).toBeTruthy()
    expect(screen.getByLabelText('Import')).toBeTruthy()
  })

  it('given the welcome page is loaded, when the "Add Feed" button is clicked, the popup to add feed must open', () => {
    render(<App />)

    const addFeed = screen.getByRole('button', { name: /Add Feed/i })

    addFeed.click()

    expect(screen.getByLabelText('Name')).toBeTruthy()
    expect(screen.getByLabelText('URL')).toBeTruthy()
  })

  it('given the "Add Feed" popup is open, when values are filled and submitted, then it must open the feed page with the real feed', async () => {
    render(<App />)

    const addFeed = screen.getByRole('button', { name: /Add Feed/i })

    addFeed.click()

    const urlInput = screen.getByLabelText('URL')
    fireEvent.change(urlInput, { target: { value: 'http://feed.rss' } })

    await waitFor(async () => {
      expect(screen.getByLabelText('Name').value).toBe('bitsapien')

      const submit = screen.getByText('Add')
      submit.click()

      await waitFor(() => {
        expect(screen.getByText('Categories')).toBeTruthy()
        screen.debug()
      })
    })
  })
})

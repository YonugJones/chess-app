import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { router } from '../routes/router'

describe('App routing', () => {
  it('renders LandingPage at /', () => {
    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/'],
    })
    render(<RouterProvider router={testRouter} />)
    expect(screen.getByText(/landingpage/i)).toBeInTheDocument()
  })

  it('renders ChessPage at /chess', () => {
    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/chess'],
    })
    render(<RouterProvider router={testRouter} />)
    expect(screen.getByText(/chesspage/i)).toBeInTheDocument()
  })
})

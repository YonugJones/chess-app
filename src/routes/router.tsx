// defines routes using createBrowserRouter

import { createBrowserRouter } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import ChessPage from '../pages/ChessPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/chess',
    element: <ChessPage />,
  },
])

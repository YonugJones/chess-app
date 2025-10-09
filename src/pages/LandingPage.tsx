import { Link } from 'react-router-dom'
import Header from '../components/Header'

const LandingPage = () => {
  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <Header />
      <div className='flex flex-1 flex-col items-center justify-center p-4 text-center space-y-4'>
        <p className='animate-appear delay-0'>
          This is a chess app created by Peter Kerfoot using Typescript, React,
          and TailwindCSS
        </p>
        <p className='animate-appear delay-1000'>
          The goal of this project is to practice implementing type-safety with
          typescript
        </p>
        <p className='animate-appear delay-2000'>
          I hope you enjoy using this app and please feel free to drop me a
          message
        </p>
        <Link
          to='/chess'
          className='
            animate-appear delay-3000
          bg-green-600 text-white px-6 py-2 rounded-lg font-semibold
            shadow-md
            transition-shadow duration-200
          hover:bg-green-700
            hover:cursor-pointer
          '
        >
          PLAY
        </Link>
      </div>
    </div>
  )
}

export default LandingPage

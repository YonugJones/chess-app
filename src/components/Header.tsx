import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className='h-10 p-2 sticky top-0 z-20 bg-white shadow-sm'>
      <div className='flex justify-between items-center'>
        <h1 className='font-bold'>CHESS</h1>
        <nav>
          <ul className='flex gap-4'>
            <li>
              <Link to='/' className='hover:text-green-600 transition-colors'>
                HOME
              </Link>
            </li>
            <li>
              <Link
                to='/chess'
                className='hover:text-green-600 transition-colors'
              >
                PLAY
              </Link>
            </li>
            <li>
              <Link
                to='/contact'
                className='hover:text-green-600 transition-colors'
              >
                CONTACT
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header

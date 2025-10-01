const Header = () => {
  return (
    <header className='h-8 p-2 sticky top-0 z-20'>
      <div className='flex justify-between'>
        <div>
          <h1>CHESS</h1>
        </div>
        <div>
          <ul className='flex gap-3'>
            <li>HOME</li>
            <li>PLAY</li>
            <li>CONTACT</li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header

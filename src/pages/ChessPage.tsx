// displays chessboard game
import Header from '../components/Header'

const ChessPage = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='flex-1 flex items-center justify-center'>
        <h1 className='text-3xl font-bold'>ChessPage</h1>
      </div>
    </div>
  )
}

export default ChessPage

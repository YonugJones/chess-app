import { useState } from 'react'
import Header from '../components/Header'
import { initializeBoard } from '../engine/board'
import type { Board, Piece } from '../engine/types'
import { pieceImages } from '../utils/pieceImages'

const ChessPage = () => {
  const [board] = useState<Board>(initializeBoard())

  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <Header />
      <div className='flex-1 flex items-center justify-center p-4'>
        {/* Board container: max width, responsive, maintains square aspect ratio */}
        <div className='grid grid-cols-8 grid-rows-8 w-full max-w-[424px] aspect-square border'>
          {/* iterates over rows */}
          {board.map((row, rowIdx) =>
            // iterates over each quare in a row
            row.map((piece: Piece | null, colIdx) => {
              const isDark = (rowIdx + colIdx) % 2 === 1
              const squareColor = isDark ? 'bg-gray-700' : 'bg-gray-200'
              const imgSrc = piece ? pieceImages[piece.color][piece.type] : null

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`${squareColor} aspect-square flex items-center justify-center`}
                >
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt={`${piece?.color} ${piece?.type}`}
                      className='w-7/8 h-7/8 object-contain'
                    />
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default ChessPage

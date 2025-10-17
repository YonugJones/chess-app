import { useState } from 'react'
import Header from '../components/Header'
import { initializeBoard } from '../engine/board'
import { getLegalMoves } from '../engine/moves'
import {
  canMoveThisTurn,
  filterIllegalMoves,
  isKingInCheck,
  isCheckmate,
  isStalemate,
} from '../engine/rules'
import {
  FILES,
  type Board,
  type Piece,
  type Square,
  type Rank,
  type Color,
} from '../engine/types'
import { pieceImages } from '../utils/pieceImages'
import { fileToIndex, rankToIndex } from '../engine/utils'

const ChessPage = () => {
  const [board, setBoard] = useState<Board>(initializeBoard())
  const [selected, setSelected] = useState<Square | null>(null)
  const [legalMoves, setLegalMoves] = useState<Square[]>([])
  const [turnNumber, setTurnNumber] = useState(1)

  const currentColor: Color = turnNumber % 2 === 1 ? 'white' : 'black'
  const isInCheck = isKingInCheck(board, currentColor)

  const handleSquareClick = (rowIdx: number, colIdx: number) => {
    const clickedSquare: Square = {
      file: FILES[colIdx],
      rank: (8 - rowIdx) as Rank,
    }
    const piece = board[rowIdx][colIdx]

    // CASE 1: move the selected piece to a legal move square
    if (
      selected &&
      legalMoves.some(
        (move) =>
          move.rank === clickedSquare.rank && move.file === clickedSquare.file
      )
    ) {
      const newBoard = board.map((row) => [...row])
      const fromRankIdx = rankToIndex(selected.rank)
      const fromFileIdx = fileToIndex(selected.file)
      const toRankIdx = rankToIndex(clickedSquare.rank)
      const toFileIdx = fileToIndex(clickedSquare.file)

      // Move piece
      newBoard[toRankIdx][toFileIdx] = newBoard[fromRankIdx][fromFileIdx]
      newBoard[fromRankIdx][fromFileIdx] = null

      // update board + turn
      setBoard(newBoard)
      setSelected(null)
      setLegalMoves([])
      setTurnNumber((prev) => prev + 1)

      // check for check, mate, and stalemate after move
      const nextColor: Color = (turnNumber + 1) % 2 === 1 ? 'white' : 'black'

      if (isCheckmate(newBoard, nextColor)) {
        alert(`${nextColor} is in checkmate!`)
      } else if (isStalemate(newBoard, nextColor)) {
        alert('Stalement! Draw.')
      } else if (isKingInCheck(newBoard, nextColor)) {
        alert(`${nextColor} is in check!`)
      }

      return
    }

    // CASE 2: deselect if clicking the same square
    if (
      selected &&
      selected.rank === clickedSquare.rank &&
      selected.file === clickedSquare.file
    ) {
      setSelected(null)
      setLegalMoves([])
      return
    }

    // CASE 3: select a piece
    if (piece) {
      if (!canMoveThisTurn(piece.color, turnNumber)) return // ignore if wrong color

      // get legal moves for this piece that won't leave king in check
      const moves = getLegalMoves(piece, clickedSquare, board)
      const safeMoves = filterIllegalMoves(moves, piece, board)

      // If king is in check, only allow moves that remove the check
      if (isKingInCheck(board, piece.color) && safeMoves.length === 0) return

      setSelected(clickedSquare)
      setLegalMoves(safeMoves.map((move) => move.to))
      return
    }

    // CASE 4: Clicked empty square
    setSelected(null)
    setLegalMoves([])
  }

  const isSquareLegalMove = (rank: Rank, file: string) =>
    legalMoves.some((move) => move.rank === rank && move.file === file)

  const isSquareSelected = (rank: Rank, file: string) =>
    selected?.rank === rank && selected?.file === file

  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <Header />
      <div className='flex-1 flex items-center justify-center p-4'>
        <div className='grid grid-cols-8 grid-rows-8 w-full max-w-[424px] aspect-square border'>
          {board.map((row, rowIdx) =>
            row.map((piece: Piece | null, colIdx) => {
              const file = FILES[colIdx]
              const rank = (8 - rowIdx) as Rank
              const isDark = (rowIdx + colIdx) % 2 === 1
              const squareColor = isDark ? 'bg-gray-700' : 'bg-gray-200'
              const imgSrc = piece ? pieceImages[piece.color][piece.type] : null

              const selectedClass = isSquareSelected(rank, file)
                ? 'after:content-[""] after:absolute after:inset-0 after:bg-yellow-400/40 after:rounded-none'
                : ''

              const checkHighlight =
                piece?.type === 'king' &&
                piece.color === currentColor &&
                isInCheck
                  ? 'after:content-[""] after:absolute after:inset-0 after:bg-red-500/40'
                  : ''

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  onClick={() => handleSquareClick(rowIdx, colIdx)}
                  className={`relative ${squareColor} ${selectedClass} ${checkHighlight} aspect-square flex items-center justify-center`}
                >
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt={`${piece?.color} ${piece?.type}`}
                      className='w-[80%] h-[80%] object-contain pointer-events-none'
                    />
                  )}
                  {isSquareLegalMove(rank, file) && (
                    <div
                      className={`absolute w-[30%] h-[30%] rounded-full ${
                        piece ? 'bg-red-500/40' : 'bg-black/25'
                      }`}
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

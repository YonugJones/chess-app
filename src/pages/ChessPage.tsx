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
  type Move,
  type PieceType,
} from '../engine/types'
import { pieceImages } from '../utils/pieceImages'
import { fileToIndex, isValidRank, rankToIndex } from '../engine/utils'

const PROMOTION_CHOICES: PieceType[] = ['queen', 'rook', 'bishop', 'knight']

const ChessPage = () => {
  const [board, setBoard] = useState<Board>(initializeBoard())
  const [selected, setSelected] = useState<Square | null>(null)
  const [legalMoves, setLegalMoves] = useState<Square[]>([])
  const [turnNumber, setTurnNumber] = useState(1)
  const [lastMove, setLastMove] = useState<Move | null>(null)

  // promotionPending holds the square where a pawn just landed and needs promotion
  const [promotionPending, setPromotionPending] = useState<{
    square: Square
    color: Color
  } | null>(null)

  const currentColor: Color = turnNumber % 2 === 1 ? 'white' : 'black'
  const isInCheck = isKingInCheck(board, currentColor)

  const finalizeAfterMove = (newBoard: Board, from: Square, to: Square) => {
    setBoard(newBoard)
    setSelected(null)
    setLegalMoves([])
    setTurnNumber((prev) => prev + 1)
    setLastMove({ from, to })

    // after state update checks (use local nextColor based on turnNumber)
    const nextColor: Color = (turnNumber + 1) % 2 === 1 ? 'white' : 'black'
    if (isCheckmate(newBoard, nextColor)) {
      alert(`${nextColor} is in checkmate!`)
    } else if (isStalemate(newBoard, nextColor)) {
      alert('Stalemate! Draw.')
    } else if (isKingInCheck(newBoard, nextColor)) {
      alert(`${nextColor} is in check!`)
    }
  }

  const handleSquareClick = (rowIdx: number, colIdx: number) => {
    // if a promotion is pending, ignore board clicks until user selects promotion piece
    if (promotionPending) return

    const clickedSquare: Square = {
      file: FILES[colIdx],
      rank: (8 - rowIdx) as Rank,
    }
    const piece = board[rowIdx][colIdx]

    // CASE 1: Move the selected piece to a legal square
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

      const movedPiece = newBoard[toRankIdx][toFileIdx]
      if (movedPiece) movedPiece.hasMoved = true // Mark moved piece

      // --- En Passant ---
      if (movedPiece?.type === 'pawn') {
        const diffRank = Math.abs(selected.rank - clickedSquare.rank)
        const diffFile = selected.file !== clickedSquare.file

        // Pawn moved diagonally into empty square → en passant capture
        if (
          diffRank === 1 &&
          diffFile &&
          board[rankToIndex(clickedSquare.rank)][
            fileToIndex(clickedSquare.file)
          ] === null
        ) {
          const captureRank =
            movedPiece.color === 'white'
              ? clickedSquare.rank - 1
              : clickedSquare.rank + 1
          if (isValidRank(captureRank)) {
            const captureIdx = rankToIndex(captureRank)
            const captureFileIdx = fileToIndex(clickedSquare.file)
            newBoard[captureIdx][captureFileIdx] = null
          }
        }
      }

      // --- Castling ---
      if (movedPiece?.type === 'king') {
        const fromFile = selected.file
        const toFile = clickedSquare.file

        // White Castling
        if (movedPiece.color === 'white' && selected.rank === 1) {
          // Kingside castle (e1 → g1)
          if (fromFile === 'e' && toFile === 'g') {
            const rookFrom = fileToIndex('h')
            const rookTo = fileToIndex('f')
            const rook = newBoard[rankToIndex(1)][rookFrom]
            if (rook) {
              newBoard[rankToIndex(1)][rookTo] = rook
              newBoard[rankToIndex(1)][rookFrom] = null
              rook.hasMoved = true
            }
          }
          // Queenside castle (e1 → c1)
          else if (fromFile === 'e' && toFile === 'c') {
            const rookFrom = fileToIndex('a')
            const rookTo = fileToIndex('d')
            const rook = newBoard[rankToIndex(1)][rookFrom]
            if (rook) {
              newBoard[rankToIndex(1)][rookTo] = rook
              newBoard[rankToIndex(1)][rookFrom] = null
              rook.hasMoved = true
            }
          }
        }

        // Black Castling
        if (movedPiece.color === 'black' && selected.rank === 8) {
          // Kingside castle (e8 → g8)
          if (fromFile === 'e' && toFile === 'g') {
            const rookFrom = fileToIndex('h')
            const rookTo = fileToIndex('f')
            const rook = newBoard[rankToIndex(8)][rookFrom]
            if (rook) {
              newBoard[rankToIndex(8)][rookTo] = rook
              newBoard[rankToIndex(8)][rookFrom] = null
              rook.hasMoved = true
            }
          }
          // Queenside castle (e8 → c8)
          else if (fromFile === 'e' && toFile === 'c') {
            const rookFrom = fileToIndex('a')
            const rookTo = fileToIndex('d')
            const rook = newBoard[rankToIndex(8)][rookFrom]
            if (rook) {
              newBoard[rankToIndex(8)][rookTo] = rook
              newBoard[rankToIndex(8)][rookFrom] = null
              rook.hasMoved = true
            }
          }
        }
      }

      // --- Pawn Promotion detection ---
      if (movedPiece?.type === 'pawn') {
        const promotionRank = movedPiece.color === 'white' ? 8 : 1
        if (clickedSquare.rank === promotionRank) {
          // place pawn at destination and wait for player's choice
          setBoard(newBoard)
          setPromotionPending({
            square: clickedSquare,
            color: movedPiece.color,
          })
          // DON'T finalize turn until player picks promotion piece
          return
        }
      }

      // If no promotion pending, finalize the move immediately
      finalizeAfterMove(newBoard, selected, clickedSquare)
      return
    }

    // CASE 2: Deselect if clicking the same square
    if (
      selected &&
      selected.rank === clickedSquare.rank &&
      selected.file === clickedSquare.file
    ) {
      setSelected(null)
      setLegalMoves([])
      return
    }

    // CASE 3: Select a piece
    if (piece) {
      if (!canMoveThisTurn(piece.color, turnNumber)) return

      const moves = getLegalMoves(piece, clickedSquare, board, lastMove)
      const safeMoves = filterIllegalMoves(moves, piece, board)

      // If king is in check and piece has no legal escape, skip
      if (isKingInCheck(board, piece.color) && safeMoves.length === 0) return

      setSelected(clickedSquare)
      setLegalMoves(safeMoves.map((move) => move.to))
      return
    }

    // CASE 4: Clicked empty square
    setSelected(null)
    setLegalMoves([])
  }

  // Player picked promotion piece from modal
  const handlePromotionPick = (choice: PieceType) => {
    if (!promotionPending) return
    const { square, color } = promotionPending
    const newBoard = board.map((row) => [...row])
    const rIdx = rankToIndex(square.rank)
    const fIdx = fileToIndex(square.file)

    // Replace pawn with chosen piece and mark hasMoved
    newBoard[rIdx][fIdx] = { type: choice, color, hasMoved: true }
    // finalize move: previous "from" is lastMove?.from — use lastMove if available,
    // otherwise we don't have the exact from saved in this path. We'll use lastMove if set.
    const from = lastMove?.from ?? { file: 'a', rank: 1 } // fallback (shouldn't happen)
    const to = square

    // clear promotion pending then finalize
    setPromotionPending(null)
    finalizeAfterMove(newBoard, from, to)
  }

  const isSquareLegalMove = (rank: Rank, file: string) =>
    legalMoves.some((move) => move.rank === rank && move.file === file)

  const isSquareSelected = (rank: Rank, file: string) =>
    selected?.rank === rank && selected?.file === file

  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <Header />
      <div className='flex-1 flex items-center justify-center p-4'>
        <div className='grid grid-cols-8 grid-rows-8 w-full max-w-[424px] aspect-square border relative'>
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

          {/* Promotion modal/overlay */}
          {promotionPending && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
              <div className='bg-white rounded p-4 shadow-lg'>
                <div className='mb-2 text-center font-semibold'>
                  Promote pawn to:
                </div>
                <div className='flex gap-2'>
                  {PROMOTION_CHOICES.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => handlePromotionPick(choice)}
                      className='px-3 py-2 border rounded hover:bg-gray-100'
                    >
                      {/* small image + label */}
                      <div className='flex flex-col items-center'>
                        <img
                          src={pieceImages[promotionPending.color][choice]}
                          alt={choice}
                          className='w-8 h-8'
                        />
                        <span className='text-xs'>{choice}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChessPage

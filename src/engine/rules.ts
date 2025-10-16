// turn, check, checkmate, castling, en passant
import type { Color } from './types'

export const canMoveThisTurn = (pieceColor: Color, turnNumber: number) => {
  const isWhiteTurn = turnNumber % 2 === 1
  return (
    (isWhiteTurn && pieceColor === 'white') ||
    (!isWhiteTurn && pieceColor === 'black')
  )
}

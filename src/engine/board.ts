// initializeBoard() lives here

/**
 *
  (rank ↑)
  8 | . . . . . . . .
  7 | . . . . . . . .
  6 | . . . . . . . .
  5 | . . . . . . . .
  4 | . . . . . . . .
  3 | . . . . . . . .
  2 | . . . . . . . .
  1 | . . . . . . . .
     a b c d e f g h → (file)
 */

import type { PieceType, Color, Piece, Board } from './types'

// Helper function which creates the piece
const createPiece = (type: PieceType, color: Color): Piece => ({
  type,
  color,
  hasMoved: false,
})

// Initialized an 8x8 chess board
export const initializeBoard = (): Board => {
  const emptyRow = Array(8).fill(null)

  // Ranks 1 and 8 with the major pieces
  const backRank = (color: Color): (Piece | null)[] => [
    createPiece('rook', color),
    createPiece('knight', color),
    createPiece('bishop', color),
    createPiece('queen', color),
    createPiece('king', color),
    createPiece('bishop', color),
    createPiece('knight', color),
    createPiece('rook', color),
  ]

  // Ranks 2 and 7 with the pawn pieces
  const pawnRank = (color: Color): (Piece | null)[] =>
    Array(8).fill(createPiece('pawn', color))

  // Assemble the full board
  const board: Board = [
    backRank('black'), // rank 8
    pawnRank('black'), // rank 7
    [...emptyRow], // rank 6
    [...emptyRow], // rank 5
    [...emptyRow], // rank 4
    [...emptyRow], // rank 3
    pawnRank('white'), // rank 2
    backRank('white'), // rank 1
  ]

  return board
}

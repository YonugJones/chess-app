// turn, check, checkmate, castling, en passant
import {
  FILES,
  type Board,
  type Color,
  type Rank,
  type Move,
  type Piece,
  type Square,
} from './types'
import { getLegalMoves } from './moves'
import { rankToIndex, fileToIndex } from './utils'

// HELPER FUNCTION: create a deep copy of the board and apply a move
export const simulateMove = (board: Board, move: Move): Board => {
  const newBoard = board.map((row) => [...row])

  const fromRankIdx = rankToIndex(move.from.rank)
  const fromFileIdx = fileToIndex(move.from.file)
  const toRankIdx = rankToIndex(move.to.rank)
  const toFileIdx = fileToIndex(move.to.file)

  // move piece
  newBoard[toRankIdx][toFileIdx] = newBoard[fromRankIdx][fromFileIdx]
  newBoard[fromRankIdx][fromFileIdx] = null

  return newBoard
}

// filter out moves that leaves the players king in check
export const filterIllegalMoves = (
  moves: Move[],
  piece: Piece,
  board: Board
): Move[] => {
  return moves.filter((move) => {
    const simulateBoard = simulateMove(board, move)
    return !isKingInCheck(simulateBoard, piece.color)
  })
}

// return all legal moves for a given color
export const getAllLegalMovesForColor = (
  board: Board,
  color: Color
): Move[] => {
  const moves: Move[] = []

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f]
      if (!piece || piece.color !== color) continue

      const from: Square = { file: FILES[f], rank: (8 - r) as Rank }
      const pieceMoves = getLegalMoves(piece, from, board)
      const legalMoves = filterIllegalMoves(pieceMoves, piece, board)
      moves.push(...legalMoves)
    }
  }

  return moves
}

// function to see if there are any legal moves while the king is in check
export const isCheckmate = (board: Board, color: Color): boolean => {
  if (!isKingInCheck(board, color)) return false
  const moves = getAllLegalMovesForColor(board, color)
  return moves.length === 0
}

// function to see if there are any legal moves while the king is not in check
export const isStalemate = (board: Board, color: Color): boolean => {
  if (isKingInCheck(board, color)) return false
  const moves = getAllLegalMovesForColor(board, color)
  return moves.length === 0
}
// RULE: turn enforcement
export const canMoveThisTurn = (pieceColor: Color, turnNumber: number) => {
  const isWhiteTurn = turnNumber % 2 === 1
  return (
    (isWhiteTurn && pieceColor === 'white') ||
    (!isWhiteTurn && pieceColor === 'black')
  )
}

// RULE: checks
export const isKingInCheck = (board: Board, color: Color): boolean => {
  let kingSquare: Square | null = null

  // Find the king
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f]
      if (piece?.type === 'king' && piece.color === color) {
        kingSquare = { file: FILES[f], rank: (8 - r) as Rank }
        break
      }
    }
    if (kingSquare) break
  }

  if (!kingSquare) return false

  const opponentColor = color === 'white' ? 'black' : 'white'

  // Check if any opponent piece attacks the king
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f]
      if (!piece || piece.color !== opponentColor) continue

      const from: Square = { file: FILES[f], rank: (8 - r) as Rank }

      // ♔ Special case: enemy king — handle manually to prevent recursion
      if (piece.type === 'king') {
        const rankDiff = Math.abs(from.rank - kingSquare.rank)
        const fileDiff = Math.abs(
          fileToIndex(from.file) - fileToIndex(kingSquare.file)
        )
        if (rankDiff <= 1 && fileDiff <= 1) {
          return true // enemy king is adjacent — attack!
        }
        continue
      }

      // For all other pieces, use getLegalMoves safely
      const moves = getLegalMoves(piece, from, board)
      if (
        moves.some(
          (m) => m.to.file === kingSquare.file && m.to.rank === kingSquare.rank
        )
      ) {
        return true
      }
    }
  }

  return false
}

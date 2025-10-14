import {
  type Board,
  type Piece,
  type Square,
  type Move,
  FILES,
  type Rank,
} from './types'
import { fileToIndex, rankToIndex, isValidRank, isSquareEmpty } from './utils'

/**
 * Generate all legal moves for a pawn
 * Pawns can move two squares forward if first turn, one square forward, or capture diagonally
 */
export const getPawnMoves = (
  piece: Piece,
  from: Square,
  board: Board
): Move[] => {
  const moves: Move[] = []

  // Determine movement direction: white moves "up" (rank +1), black moves "down" (rank -1)
  const direction = piece.color === 'white' ? 1 : -1

  // Calculate one-step and two-step forward ranks
  const oneStep = from.rank + 1 * direction
  const twoStep = from.rank + 2 * direction

  const fileIdx = fileToIndex(from.file)

  // PAWN one step forward: check bounds and that square is empty
  if (isValidRank(oneStep)) {
    const rankIdx = rankToIndex(oneStep)
    if (isSquareEmpty(board, rankIdx, fileIdx)) {
      moves.push({
        from,
        to: { file: from.file, rank: oneStep },
      })
    }
  }

  // PAWN two steps forward: only allowed from starting rank, and both squares must be empty
  const startRank = piece.color === 'white' ? 2 : 7
  if (from.rank === startRank && isValidRank(oneStep) && isValidRank(twoStep)) {
    const oneIdx = rankToIndex(oneStep)
    const twoIdx = rankToIndex(twoStep)
    if (board[oneIdx][fileIdx] === null && board[twoIdx][fileIdx] === null) {
      moves.push({
        from,
        to: { file: from.file, rank: twoStep },
      })
    }
  }

  // PAWN captures diagonally: check one square diagonally left and right
  for (const fileOffset of [-1, 1]) {
    const captureFileIdx = fileIdx + fileOffset
    if (captureFileIdx >= 0 && captureFileIdx < 8 && isValidRank(oneStep)) {
      const targetPiece = board[rankToIndex(oneStep)][captureFileIdx]
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push({
          from,
          to: {
            file: FILES[captureFileIdx], // convert index back to File
            rank: oneStep,
          },
        })
      }
    }
  }

  return moves
}

/**
 * Generate all legal moves for a rook
 * Rooks can move horizontally and vertically until blocked
 */
export const getRookMoves = (
  piece: Piece,
  from: Square,
  board: Board
): Move[] => {
  const moves: Move[] = []

  // Define four possible directions: up, down, right, left
  const directions = [
    [1, 0], // up (rank +1)
    [-1, 0], // down (rank -1)
    [0, 1], // right (file +1)
    [0, -1], // left (file -1)
  ] as const

  const startRankIdx = rankToIndex(from.rank)
  const startFileIdx = fileToIndex(from.file)

  // Loop through each direction
  for (const [rankDir, fileDir] of directions) {
    let rankIdx = startRankIdx + rankDir
    let fileIdx = startFileIdx + fileDir

    // Keep moving in this direction until hitting board edge or blocked
    while (rankIdx >= 0 && rankIdx < 8 && fileIdx >= 0 && fileIdx < 8) {
      const target = board[rankIdx][fileIdx]
      const rank = (8 - rankIdx) as Rank // convert rank index back to Rank
      const file = FILES[fileIdx] // convert file index back to File

      if (!target) {
        // Empty square → legal move, continue sliding
        moves.push({ from, to: { file, rank } })
      } else {
        if (target.color !== piece.color) {
          // Enemy piece → capture move, then stop in this direction
          moves.push({ from, to: { file, rank } })
        }
        // Friendly piece or enemy piece captured → stop sliding
        break
      }

      // Advance to next square in the same direction
      rankIdx += rankDir
      fileIdx += fileDir
    }
  }

  return moves
}

/**
 * Generate all legal moves for a bishop
 * Bishops can move diagonally until blocked
 */
export const getBishopMoves = (
  piece: Piece,
  from: Square,
  board: Board
): Move[] => {
  const moves: Move[] = []

  // Define four possible diagonal directions
  const directions = [
    [1, 1], // up / right: rank + 1, file + 1
    [1, -1], // up / left: rank + 1, file - 1
    [-1, 1], // down / right: rank -1, file + 1
    [-1, -1], // down / left: rank -1, file - 1
  ] as const

  const startRankIdx = rankToIndex(from.rank)
  const startFileIdx = fileToIndex(from.file)

  // Loop through each direction
  for (const [rankDir, fileDir] of directions) {
    let rankIdx = startRankIdx + rankDir
    let fileIdx = startFileIdx + fileDir

    // Keep moving in this direction until hitting board edge or blocked
    while (rankIdx >= 0 && rankIdx < 8 && fileIdx >= 0 && fileIdx < 8) {
      const target = board[rankIdx][fileIdx]
      const rank = (8 - rankIdx) as Rank // convert rankIdx back to rank, 0 - 7 → 1 - 8
      const file = FILES[fileIdx]

      if (!target) {
        // empty square → legal move, continue sliding
        moves.push({ from, to: { file, rank } })
      } else {
        if (target.color !== piece.color) {
          // enemy piece → capture piece then stop on that square
          moves.push({ from, to: { file, rank } })
        }
        // Friendly piece or enemy piece captured → stop sliding
        break
      }
      // Advance to next square in the same direction
      rankIdx += rankDir
      fileIdx += fileDir
    }
  }

  return moves
}

/**
 * Generate all legal moves for a queen
 * queens can move like rooks or bishops
 */
export const getQueenMoves = (
  piece: Piece,
  from: Square,
  board: Board
): Move[] => [
  ...getRookMoves(piece, from, board),
  ...getBishopMoves(piece, from, board),
]

/**
 * Generate all legal moves for a knight
 * Knights can move in 2 then 1, or 1 then two 'L' shape steps
 */
export const getKnightMoves = (
  piece: Piece,
  from: Square,
  board: Board
): Move[] => {
  const moves: Move[] = []

  // Define eight possible diagonal directions
  const directions = [
    [2, 1], // rank + 2, file +1
    [1, 2], // rank + 1, file + 2
    [-1, 2], // rank - 1, file + 2
    [-2, 1], // rank -2, file + 1
    [-2, -1], // rank -2, file -1
    [-1, -2], // rank -1, file -2
    [1, -2], // rank + 1, file -2
    [2, -1], // rank + 2, file -1
  ] as const

  const startRankIdx = rankToIndex(from.rank)
  const startFileIdx = fileToIndex(from.file)

  // Loop through each direction
  for (const [rankDir, fileDir] of directions) {
    const rankIdx = startRankIdx + rankDir
    const fileIdx = startFileIdx + fileDir

    // check if inside board bounds, skip out of bounds squares
    if (rankIdx < 0 || rankIdx >= 8 || fileIdx < 0 || fileIdx >= 8) continue

    const target = board[rankIdx][fileIdx]
    const rank = (8 - rankIdx) as Rank
    const file = FILES[fileIdx]

    // empty square or enemy piece → valid move
    if (!target || target.color !== piece.color) {
      moves.push({ from, to: { file, rank } })
    }
  }

  return moves
}

/**
 * Generate all legal moves for a knight
 * Knights can move in 2 then 1, or 1 then two 'L' shape steps
 */
export const getKingMoves = (
  piece: Piece,
  from: Square,
  board: Board
): Move[] => {
  const moves: Move[] = []

  // Define 8 possible directions for king
  const directions = [
    [1, 1], // rank + 1, file + 1
    [0, 1], // rank + 0, file + 1
    [-1, 1], // rank - 1, file + 1
    [-1, 0], // rank - 1, file + 0
    [-1, -1], // rank - 1, file - 1
    [0, -1], // rank + 0, file - 1
    [1, -1], // rank + 1, file - 1
    [1, 0], // rank + 1, file + 0
  ] as const

  const startRankIdx = rankToIndex(from.rank)
  const startFileIdx = fileToIndex(from.file)

  // loop through each direction
  for (const [rankDir, fileDir] of directions) {
    const rankIdx = startRankIdx + rankDir
    const fileIdx = startFileIdx + fileDir

    // check if inside board bounds, skip out of bounds squares
    if (rankIdx < 0 || rankIdx >= 8 || fileIdx < 0 || fileIdx >= 8) continue
    const target = board[rankIdx][fileIdx]
    const rank = (8 - rankIdx) as Rank
    const file = FILES[fileIdx]

    // empty square or piece → valid move
    if (!target || target.color !== piece.color) {
      moves.push({ from, to: { file, rank } })
    }
  }

  return moves
}

/**
 * Filter function to get moves depending on switch statement piece type
 */
export const getLegalMoves = (
  piece: Piece,
  from: Square,
  board: Board
): Move[] => {
  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(piece, from, board)
    case 'rook':
      return getRookMoves(piece, from, board)
    case 'knight':
      return getKnightMoves(piece, from, board)
    case 'bishop':
      return getBishopMoves(piece, from, board)
    case 'queen':
      return getQueenMoves(piece, from, board)
    case 'king':
      return getKingMoves(piece, from, board)
    default:
      return []
  }
}

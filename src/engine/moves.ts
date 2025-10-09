// move logic here

import { type Board, type Piece, type Square, type Move, FILES } from './types'
import { fileToIndex, rankToIndex, isValidRank, isSquareEmpty } from './utils'

export const getPawnMoves = (
  piece: Piece,
  from: Square,
  board: Board
): Move[] => {
  const moves: Move[] = []
  const direction = piece.color === 'white' ? 1 : -1 // positive or negative direction in regards to board

  const oneStep = from.rank + 1 * direction
  const twoStep = from.rank + 2 * direction

  const fileIdx = fileToIndex(from.file)

  // PAWN one step: check bounds first
  if (isValidRank(oneStep)) {
    const rankIdx = rankToIndex(oneStep) // rankToIndex now accepts rank after util function validates rank is 1 through 8
    if (isSquareEmpty(board, rankIdx, fileIdx)) {
      // if selected pawn destination square does not hold a piece
      moves.push({
        from,
        to: { file: from.file, rank: oneStep },
      })
    }
  }

  // PAWN two step: only if on starting rank and both squares are valid and empty
  const startRank = piece.color === 'white' ? 2 : 7
  if (from.rank === startRank && isValidRank(oneStep) && isValidRank(twoStep)) {
    const oneIdx = rankToIndex(oneStep)
    const twoIdx = rankToIndex(twoStep)
    if (board[oneIdx][fileIdx] === null && board[twoIdx][fileIdx] === null) {
      moves.push({ from, to: { file: from.file, rank: twoStep } })
    }
  }

  // PAWN capture diagonally
  for (const fileOffset of [-1, 1]) {
    const captureFileIdx = fileIdx + fileOffset
    if (captureFileIdx >= 0 && captureFileIdx <= 7 && isValidRank(oneStep)) {
      const targetPiece = board[rankToIndex(oneStep)][captureFileIdx]
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push({
          from,
          to: {
            file: FILES[captureFileIdx],
            rank: oneStep,
          },
        })
      }
    }
  }

  return moves
}

import type { Rank, File, Board } from './types'

// helper function to check if square has piece on it
export const isSquareEmpty = (
  board: Board,
  rankIndex: number,
  fileIndex: number
): boolean => {
  return board[rankIndex]?.[fileIndex] === null
}

// helper function to convert File and Rank to index numbers
export const fileToIndex = (file: File): number => 'abcdefgh'.indexOf(file)
export const rankToIndex = (rank: Rank): number => 8 - rank

// helper function to type check oneStep number is 1 through 8
export const isValidRank = (n: number): n is Rank =>
  Number.isInteger(n) && n >= 1 && n <= 8

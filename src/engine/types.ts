export type Color = 'white' | 'black'

export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'

export interface Piece {
  type: PieceType
  color: Color
  hasMoved?: boolean
}

export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'
export const FILES: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type Square = {
  file: File
  rank: Rank
}

export type Board = (Piece | null)[][]

export interface Move {
  from: Square
  to: Square
  promotion?: PieceType
}

export interface GameState {
  board: Board
  turn: Color
  selectedPiece?: { square: Square; piece: Piece }
  legalMoves: Move[]
  isCheck?: Color
  winner?: Color | 'draw'
}

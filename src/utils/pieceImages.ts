import bp from '../assets/bp.png'
import bn from '../assets/bn.png'
import bb from '../assets/bb.png'
import br from '../assets/br.png'
import bq from '../assets/bq.png'
import bk from '../assets/bk.png'
import wp from '../assets/wp.png'
import wn from '../assets/wn.png'
import wb from '../assets/wb.png'
import wr from '../assets/wr.png'
import wq from '../assets/wq.png'
import wk from '../assets/wk.png'

import type { PieceType, Color } from '../engine/types'

export const pieceImages: Record<Color, Record<PieceType, string>> = {
  white: {
    pawn: wp,
    knight: wn,
    bishop: wb,
    rook: wr,
    queen: wq,
    king: wk,
  },
  black: {
    pawn: bp,
    knight: bn,
    bishop: bb,
    rook: br,
    queen: bq,
    king: bk,
  },
}

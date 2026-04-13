export type PlayerPosition =
  | 'goleiro'
  | 'zagueiro'
  | 'lateral_direito'
  | 'lateral_esquerdo'
  | 'volante'
  | 'meia'
  | 'ponta_direita'
  | 'ponta_esquerda'
  | 'centroavante'

export interface PositionMeta {
  code: PlayerPosition
  name: string
  abbreviation: string
}

export const POSITIONS: Record<PlayerPosition, PositionMeta> = {
  goleiro: { code: 'goleiro', name: 'Goleiro', abbreviation: 'GOL' },
  zagueiro: { code: 'zagueiro', name: 'Zagueiro', abbreviation: 'ZAG' },
  lateral_direito: { code: 'lateral_direito', name: 'Lateral Direito', abbreviation: 'LD' },
  lateral_esquerdo: { code: 'lateral_esquerdo', name: 'Lateral Esquerdo', abbreviation: 'LE' },
  volante: { code: 'volante', name: 'Volante', abbreviation: 'VOL' },
  meia: { code: 'meia', name: 'Meia', abbreviation: 'MEI' },
  ponta_direita: { code: 'ponta_direita', name: 'Ponta Direita', abbreviation: 'PD' },
  ponta_esquerda: { code: 'ponta_esquerda', name: 'Ponta Esquerda', abbreviation: 'PE' },
  centroavante: { code: 'centroavante', name: 'Centroavante', abbreviation: 'CA' },
}

export const POSITION_LIST = Object.values(POSITIONS)

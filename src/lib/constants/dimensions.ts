export type DimensionCode =
  | 'd1_scanning'
  | 'd2_decision'
  | 'd3_off_ball'
  | 'd4_orientation'
  | 'd5_anticipation'
  | 'd6_resilience'
  | 'd7_communication'

export interface DimensionMeta {
  code: DimensionCode
  number: number
  name: string
  subtitle: string
  reference: string
  weight: number
  color: string
  description: string
}

export const DIMENSIONS: Record<DimensionCode, DimensionMeta> = {
  d1_scanning: {
    code: 'd1_scanning',
    number: 1,
    name: 'Scanning',
    subtitle: 'Leitura do campo antes de receber',
    reference: 'Xavi',
    weight: 0.20,
    color: '#3B82F6', // blue
    description:
      'Capacidade de escanear o campo antes de receber a bola. Olhar ao redor para mapear posicionamento de companheiros e adversários.',
  },
  d2_decision: {
    code: 'd2_decision',
    number: 2,
    name: 'Decisão',
    subtitle: 'Melhor opção sob pressão em <0,5s',
    reference: 'Messi',
    weight: 0.25,
    color: '#8B5CF6', // purple
    description:
      'Velocidade e qualidade da tomada de decisão sob pressão. Escolher a melhor opção disponível em frações de segundo.',
  },
  d3_off_ball: {
    code: 'd3_off_ball',
    number: 3,
    name: 'Off-Ball',
    subtitle: 'Criação inteligente de espaços sem bola',
    reference: 'Müller',
    weight: 0.15,
    color: '#10B981', // emerald
    description:
      'Movimentação inteligente sem a bola para criar espaços, linhas de passe e oportunidades para o time.',
  },
  d4_orientation: {
    code: 'd4_orientation',
    number: 4,
    name: 'Orientação',
    subtitle: 'Corpo orientado para melhor opção ao receber',
    reference: 'Modrić',
    weight: 0.10,
    color: '#F59E0B', // amber
    description:
      'Posicionamento corporal ao receber a bola, já orientado para a melhor opção de passe, condução ou finalização.',
  },
  d5_anticipation: {
    code: 'd5_anticipation',
    number: 5,
    name: 'Antecipação',
    subtitle: 'Interceptação antes da jogada existir',
    reference: 'Rodri',
    weight: 0.10,
    color: '#EF4444', // red
    description:
      'Leitura antecipada do jogo para interceptar passes, cortar jogadas e se posicionar antes que a ação aconteça.',
  },
  d6_resilience: {
    code: 'd6_resilience',
    number: 6,
    name: 'Resiliência',
    subtitle: 'Mantém performance após adversidade',
    reference: 'Cristiano Ronaldo',
    weight: 0.10,
    color: '#F97316', // orange
    description:
      'Capacidade de manter ou elevar o nível de performance após sofrer gol, erro próprio, falta dura ou pressão do adversário.',
  },
  d7_communication: {
    code: 'd7_communication',
    number: 7,
    name: 'Comunicação',
    subtitle: 'Organiza coletivo, coordena pressão',
    reference: 'Thiago Silva',
    weight: 0.10,
    color: '#06B6D4', // cyan
    description:
      'Liderança em campo: organizar a linha, coordenar pressão, orientar companheiros, comunicar de forma efetiva durante o jogo.',
  },
}

export const DIMENSION_CODES = Object.keys(DIMENSIONS) as DimensionCode[]

export const DIMENSION_LIST = Object.values(DIMENSIONS)

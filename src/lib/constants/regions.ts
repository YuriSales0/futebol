export type BrazilianRegion =
  | 'norte'
  | 'nordeste'
  | 'centro_oeste'
  | 'sudeste'
  | 'sul'

export interface RegionMeta {
  code: BrazilianRegion
  name: string
  states: string[]
}

export const REGIONS: Record<BrazilianRegion, RegionMeta> = {
  norte: {
    code: 'norte',
    name: 'Norte',
    states: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
  },
  nordeste: {
    code: 'nordeste',
    name: 'Nordeste',
    states: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
  },
  centro_oeste: {
    code: 'centro_oeste',
    name: 'Centro-Oeste',
    states: ['DF', 'GO', 'MT', 'MS'],
  },
  sudeste: {
    code: 'sudeste',
    name: 'Sudeste',
    states: ['ES', 'MG', 'RJ', 'SP'],
  },
  sul: {
    code: 'sul',
    name: 'Sul',
    states: ['PR', 'RS', 'SC'],
  },
}

export const STATE_TO_REGION: Record<string, BrazilianRegion> = {
  AC: 'norte', AP: 'norte', AM: 'norte', PA: 'norte',
  RO: 'norte', RR: 'norte', TO: 'norte',
  AL: 'nordeste', BA: 'nordeste', CE: 'nordeste', MA: 'nordeste',
  PB: 'nordeste', PE: 'nordeste', PI: 'nordeste', RN: 'nordeste', SE: 'nordeste',
  DF: 'centro_oeste', GO: 'centro_oeste', MT: 'centro_oeste', MS: 'centro_oeste',
  ES: 'sudeste', MG: 'sudeste', RJ: 'sudeste', SP: 'sudeste',
  PR: 'sul', RS: 'sul', SC: 'sul',
}

export const BRAZILIAN_STATES: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas',
  BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo',
  GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná',
  PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina',
  SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
}

export const REGION_LIST = Object.values(REGIONS)

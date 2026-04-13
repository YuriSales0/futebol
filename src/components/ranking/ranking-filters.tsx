'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select } from '@/components/ui/select'
import { REGION_LIST } from '@/lib/constants/regions'
import { POSITION_LIST } from '@/lib/constants/positions'

const regionOptions = [
  { value: '', label: 'Todas as regiões' },
  ...REGION_LIST.map((r) => ({ value: r.code, label: r.name })),
]

const positionOptions = [
  { value: '', label: 'Todas as posições' },
  ...POSITION_LIST.map((p) => ({ value: p.code, label: p.name })),
]

const ageOptions = [
  { value: '', label: 'Todas as idades' },
  { value: '11-13', label: '11–13 anos' },
  { value: '14-15', label: '14–15 anos' },
  { value: '16-17', label: '16–17 anos' },
]

export function RankingFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/ranking?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      <Select
        options={regionOptions}
        value={searchParams.get('regiao') || ''}
        onChange={(e) => handleChange('regiao', e.target.value)}
      />
      <Select
        options={positionOptions}
        value={searchParams.get('posicao') || ''}
        onChange={(e) => handleChange('posicao', e.target.value)}
      />
      <Select
        options={ageOptions}
        value={searchParams.get('idade') || ''}
        onChange={(e) => handleChange('idade', e.target.value)}
      />
    </div>
  )
}

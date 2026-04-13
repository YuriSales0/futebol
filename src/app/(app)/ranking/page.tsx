import { createClient } from '@/lib/supabase/server'
import { RankingFilters } from '@/components/ranking/ranking-filters'
import { RankingTable } from '@/components/ranking/ranking-table'
import { REGIONS } from '@/lib/constants/regions'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import type { RankedPlayer } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Ranking Regional',
}

async function RankingContent({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const supabase = await createClient()

  // Build query - we query the view directly
  let query = supabase
    .from('regional_rankings')
    .select('*')
    .order('total_gie', { ascending: false })
    .limit(50)

  // Apply region filter
  const region = searchParams.regiao
  if (region && region in REGIONS) {
    query = query.eq('region', region)
  }

  // Apply position filter
  const position = searchParams.posicao
  if (position) {
    query = query.eq('position', position)
  }

  const { data: players } = await query

  // Filter by age on the client side (can't do date math easily in Supabase query)
  let filtered: RankedPlayer[] = (players as RankedPlayer[] | null) || []

  const ageRange = searchParams.idade
  if (ageRange) {
    const [minAge, maxAge] = ageRange.split('-').map(Number)
    const now = new Date()
    filtered = filtered.filter((p) => {
      const dob = new Date(p.date_of_birth)
      let age = now.getFullYear() - dob.getFullYear()
      const m = now.getMonth() - dob.getMonth()
      if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--
      return age >= minAge && age <= maxAge
    })
  }

  return <RankingTable players={filtered} />
}

export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Ranking Regional</h1>
      <Suspense fallback={null}>
        <RankingFilters />
      </Suspense>
      <Suspense
        fallback={
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        }
      >
        <RankingContent searchParams={params} />
      </Suspense>
    </div>
  )
}

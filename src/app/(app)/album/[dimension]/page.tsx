import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { DIMENSIONS } from '@/lib/constants/dimensions'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatTimestamp } from '@/lib/utils/formatting'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { DimensionCode } from '@/lib/constants/dimensions'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dimension: string }>
}): Promise<Metadata> {
  const { dimension } = await params
  const dim = DIMENSIONS[dimension as DimensionCode]
  if (!dim) return { title: 'Dimensão' }
  return { title: `D${dim.number} — ${dim.name}` }
}

export default async function DimensionDetailPage({
  params,
}: {
  params: Promise<{ dimension: string }>
}) {
  const { dimension } = await params
  const dim = DIMENSIONS[dimension as DimensionCode]
  if (!dim) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!player) redirect('/cadastro')

  const { data: entries } = await supabase
    .from('dimension_entries')
    .select('*, videos(original_filename, match_description)')
    .eq('player_id', player.id)
    .eq('dimension', dimension)
    .order('is_primary', { ascending: false })

  const hasEntries = entries && entries.length > 0

  return (
    <div className="space-y-4">
      {/* Dimension header */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: dim.color }}
        >
          D{dim.number}
        </div>
        <div>
          <h1 className="text-xl font-bold">{dim.name}</h1>
          <p className="text-sm text-muted">{dim.subtitle}</p>
        </div>
      </div>

      <Card variant="bordered">
        <p className="text-sm text-muted">{dim.description}</p>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="info" size="sm">Peso: {dim.weight * 100}%</Badge>
          <Badge size="sm">Ref: {dim.reference}</Badge>
        </div>
      </Card>

      {hasEntries ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Suas entradas</h2>
            <Link
              href={`/album/${dimension}/novo`}
              className="text-sm text-primary font-medium hover:underline"
            >
              + Adicionar
            </Link>
          </div>
          {entries.map((entry) => (
            <Card key={entry.id} variant="bordered">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {entry.is_primary && (
                    <Badge variant="success" size="sm" className="mb-1">Principal</Badge>
                  )}
                  <p className="text-sm">{entry.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted">
                    <span>
                      {formatTimestamp(entry.start_time_seconds)} — {formatTimestamp(entry.end_time_seconds)}
                    </span>
                    {(entry.videos as { original_filename: string } | null)?.original_filename && (
                      <span className="truncate max-w-[150px]">
                        {(entry.videos as { original_filename: string }).original_filename}
                      </span>
                    )}
                  </div>
                </div>
                {entry.self_score && (
                  <span
                    className="text-lg font-bold shrink-0 ml-3"
                    style={{ color: dim.color }}
                  >
                    {entry.self_score}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20"
            style={{ backgroundColor: dim.color }}
          >
            <span className="text-white text-2xl font-bold">D{dim.number}</span>
          </div>
          <h3 className="font-semibold mb-1">Slot vazio</h3>
          <p className="text-sm text-muted mb-4">
            Selecione um trecho de vídeo que demonstre sua capacidade em {dim.name}.
          </p>
          <Link
            href={`/album/${dimension}/novo`}
            className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Preencher dimensão
          </Link>
        </div>
      )}
    </div>
  )
}

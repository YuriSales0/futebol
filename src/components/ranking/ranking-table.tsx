import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { DiamondBadge } from './diamond-badge'
import { POSITIONS } from '@/lib/constants/positions'
import { formatAge } from '@/lib/utils/age'
import type { RankedPlayer } from '@/lib/types'

interface RankingTableProps {
  players: RankedPlayer[]
}

export function RankingTable({ players }: RankingTableProps) {
  if (players.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.024 6.024 0 01-2.77.752H10.5a6.024 6.024 0 01-2.77-.752" />
        </svg>
        <h3 className="font-semibold mb-1">Nenhum jogador encontrado</h3>
        <p className="text-sm text-muted">
          Tente ajustar os filtros ou seja o primeiro a completar seu álbum nesta categoria!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {players.map((player) => {
        const isDiamond = player.region_percentile >= 0.95
        const position = POSITIONS[player.position]

        return (
          <Link
            key={player.player_id}
            href={`/jogador/${player.player_id}`}
            className="flex items-center gap-3 p-3 bg-white border border-border rounded-lg hover:shadow-sm transition-shadow"
          >
            {/* Rank number */}
            <div className="w-8 text-center shrink-0">
              <span className={`text-lg font-bold ${player.region_rank <= 3 ? 'text-primary' : 'text-muted'}`}>
                {player.region_rank}
              </span>
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
              {player.full_name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-sm truncate">
                  {player.nickname || player.full_name}
                </span>
                {isDiamond && <DiamondBadge />}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="info" size="sm">{position?.abbreviation || player.position}</Badge>
                <span className="text-xs text-muted">{player.city}, {player.state}</span>
                <span className="text-xs text-muted">{formatAge(player.date_of_birth)}</span>
              </div>
            </div>

            {/* Score */}
            <div className="text-right shrink-0">
              <div className="text-lg font-bold text-primary">
                {player.total_gie ? Number(player.total_gie).toFixed(1) : '-'}
              </div>
              <div className="text-[10px] text-muted">GIE</div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

import Link from 'next/link'
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
      <div className="text-center py-16">
        <div className="text-4xl mb-4">🏆</div>
        <h3 className="font-bold mb-1">Nenhum jogador encontrado</h3>
        <p className="text-sm text-muted">
          Tente ajustar os filtros ou seja o primeiro a completar seu álbum!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {players.map((player, index) => {
        const isDiamond = player.region_percentile >= 0.95
        const position = POSITIONS[player.position]
        const isTop3 = player.region_rank <= 3

        return (
          <Link
            key={player.player_id}
            href={`/jogador/${player.player_id}`}
            className="flex items-center gap-3 p-3 bg-surface border border-border rounded-2xl card-hover"
          >
            {/* Rank */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-black ${
              isTop3
                ? 'bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/30'
                : 'bg-surface-2 text-muted border border-border'
            }`}>
              {player.region_rank}
            </div>

            {/* Avatar */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
              isTop3
                ? 'bg-gradient-to-br from-primary to-emerald-400 text-background shadow-md shadow-primary/20'
                : 'bg-surface-2 text-muted border border-border'
            }`}>
              {player.full_name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm truncate">
                  {player.nickname || player.full_name}
                </span>
                {isDiamond && <DiamondBadge />}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md px-1.5 py-0.5">
                  {position?.abbreviation || player.position}
                </span>
                <span className="text-[10px] text-muted">{player.city}, {player.state}</span>
                <span className="text-[10px] text-muted">{formatAge(player.date_of_birth)}</span>
              </div>
            </div>

            {/* Score */}
            <div className="text-right shrink-0">
              <div className="text-lg font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {player.total_gie ? Number(player.total_gie).toFixed(1) : '—'}
              </div>
              <div className="text-[9px] text-muted font-bold uppercase tracking-wider">GIE</div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

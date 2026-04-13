import { Badge } from '@/components/ui/badge'
import { POSITIONS } from '@/lib/constants/positions'
import { REGIONS } from '@/lib/constants/regions'
import { formatAge } from '@/lib/utils/age'
import type { Player } from '@/lib/types'

interface ProfileHeaderProps {
  player: Player
  gieScore?: number | null
}

export function ProfileHeader({ player, gieScore }: ProfileHeaderProps) {
  const position = POSITIONS[player.position]
  const region = REGIONS[player.region]

  return (
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xl shrink-0">
        {player.full_name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-black truncate">{player.full_name}</h1>
        {player.nickname && (
          <p className="text-sm text-primary/70 truncate">&quot;{player.nickname}&quot;</p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Badge variant="info">{position?.abbreviation || player.position}</Badge>
          <Badge>{player.city}, {player.state}</Badge>
          <Badge variant="success">{region?.name || player.region}</Badge>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted">
          <span>{formatAge(player.date_of_birth)}</span>
          {player.height_cm && <span>{player.height_cm}cm</span>}
          {player.preferred_foot && (
            <span>Pé {player.preferred_foot}</span>
          )}
          {gieScore !== null && gieScore !== undefined && gieScore > 0 && (
            <span className="font-black text-primary text-sm">GIE {gieScore.toFixed(1)}</span>
          )}
        </div>
      </div>
    </div>
  )
}

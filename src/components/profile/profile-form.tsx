'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePlayer } from '@/actions/player'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { POSITION_LIST } from '@/lib/constants/positions'
import { BRAZILIAN_STATES } from '@/lib/constants/regions'
import type { Player } from '@/lib/types'

const stateOptions = Object.entries(BRAZILIAN_STATES)
  .map(([code, name]) => ({ value: code, label: `${code} - ${name}` }))
  .sort((a, b) => a.label.localeCompare(b.label))

const positionOptions = POSITION_LIST.map((p) => ({
  value: p.code,
  label: p.name,
}))

const footOptions = [
  { value: 'direito', label: 'Direito' },
  { value: 'esquerdo', label: 'Esquerdo' },
  { value: 'ambos', label: 'Ambos' },
]

interface ProfileFormProps {
  player: Player
}

export function ProfileForm({ player }: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const result = await updatePlayer({
      fullName: formData.get('fullName') as string,
      nickname: (formData.get('nickname') as string) || undefined,
      position: formData.get('position') as Player['position'],
      secondaryPosition: (formData.get('secondaryPosition') as Player['position']) || undefined,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      heightCm: formData.get('heightCm') ? Number(formData.get('heightCm')) : undefined,
      preferredFoot: (formData.get('preferredFoot') as 'direito' | 'esquerdo' | 'ambos') || undefined,
      currentClub: (formData.get('currentClub') as string) || undefined,
      bio: (formData.get('bio') as string) || undefined,
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/perfil')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-error text-sm p-3 rounded-lg">{error}</div>
      )}

      <Input id="fullName" name="fullName" label="Nome completo" defaultValue={player.full_name} required />
      <Input id="nickname" name="nickname" label="Apelido" defaultValue={player.nickname || ''} />

      <div className="grid grid-cols-2 gap-3">
        <Select id="position" name="position" label="Posição" options={positionOptions} defaultValue={player.position} required />
        <Select id="secondaryPosition" name="secondaryPosition" label="Posição 2" options={positionOptions} defaultValue={player.secondary_position || ''} placeholder="Opcional" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input id="city" name="city" label="Cidade" defaultValue={player.city} required />
        <Select id="state" name="state" label="Estado" options={stateOptions} defaultValue={player.state} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input id="heightCm" name="heightCm" label="Altura (cm)" type="number" min={100} max={220} defaultValue={player.height_cm || ''} />
        <Select id="preferredFoot" name="preferredFoot" label="Pé preferido" options={footOptions} defaultValue={player.preferred_foot || ''} placeholder="Selecione" />
      </div>

      <Input id="currentClub" name="currentClub" label="Clube/Escolinha atual" defaultValue={player.current_club || ''} />
      <Textarea id="bio" name="bio" label="Bio" rows={3} maxLength={500} defaultValue={player.bio || ''} placeholder="Conte um pouco sobre você como jogador..." />

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          Salvar
        </Button>
      </div>
    </form>
  )
}

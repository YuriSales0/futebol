'use client'

import { useState } from 'react'
import { signOut } from '@/actions/auth'
import { deleteAccount } from '@/actions/player'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDeleteAccount() {
    if (!confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) return
    if (!confirm('Última confirmação: todos os seus dados serão removidos permanentemente.')) return

    setDeleting(true)
    const result = await deleteAccount()
    if (result.error) {
      alert(result.error)
      setDeleting(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black">Configurações</h1>

      <div className="bg-surface border border-border rounded-2xl p-5">
        <h3 className="font-bold mb-3">Conta</h3>
        <form action={signOut}>
          <Button variant="outline" type="submit" className="w-full">
            Sair da conta
          </Button>
        </form>
      </div>

      <div className="bg-surface border border-error/20 rounded-2xl p-5">
        <h3 className="font-bold text-error mb-2">Zona de perigo</h3>
        <p className="text-xs text-muted mb-3 leading-relaxed">
          Ao deletar sua conta, todos os seus dados, vídeos e dimensões serão removidos permanentemente.
          Essa ação é irreversível.
        </p>
        <Button variant="danger" onClick={handleDeleteAccount} loading={deleting} className="w-full">
          Deletar minha conta
        </Button>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-muted/50">GIE v1.0 — Game Intelligence Engine</p>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { signOut } from '@/actions/auth'
import { deleteAccount } from '@/actions/player'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
      <h1 className="text-xl font-bold">Configurações</h1>

      <Card variant="bordered">
        <h3 className="font-semibold mb-3">Conta</h3>
        <form action={signOut}>
          <Button variant="outline" type="submit" className="w-full">
            Sair da conta
          </Button>
        </form>
      </Card>

      <Card variant="bordered" className="border-red-200">
        <h3 className="font-semibold text-error mb-2">Zona de perigo</h3>
        <p className="text-sm text-muted mb-3">
          Ao deletar sua conta, todos os seus dados, vídeos e dimensões serão removidos permanentemente.
        </p>
        <Button variant="danger" onClick={handleDeleteAccount} loading={deleting} className="w-full">
          Deletar minha conta
        </Button>
      </Card>
    </div>
  )
}

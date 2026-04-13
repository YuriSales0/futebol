'use client'

import { Button } from '@/components/ui/button'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl mb-4">🔧</div>
      <h2 className="text-lg font-bold mb-2">Erro no painel admin</h2>
      <p className="text-sm text-muted mb-6 max-w-sm">
        Ocorreu um erro ao carregar os dados. Verifique sua conexão e tente novamente.
      </p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  )
}

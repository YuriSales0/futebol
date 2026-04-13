'use client'

import { Button } from '@/components/ui/button'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl mb-4">⚠️</div>
      <h2 className="text-lg font-bold mb-2">Algo deu errado</h2>
      <p className="text-sm text-muted mb-6 max-w-sm">
        Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.
      </p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  )
}

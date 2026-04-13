'use client'

import { useState } from 'react'
import { approveConsent, rejectConsent } from '@/actions/consent'
import { Button } from '@/components/ui/button'

export function ConsentPage({ token }: { token: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'approved' | 'rejected' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleApprove() {
    setStatus('loading')
    const result = await approveConsent(token)
    if (result.error) {
      setErrorMsg(result.error)
      setStatus('error')
    } else {
      setStatus('approved')
    }
  }

  async function handleReject() {
    setStatus('loading')
    const result = await rejectConsent(token)
    if (result.error) {
      setErrorMsg(result.error)
      setStatus('error')
    } else {
      setStatus('rejected')
    }
  }

  if (status === 'approved') {
    return (
      <div className="bg-white rounded-xl border border-border p-6 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Consentimento Aprovado</h2>
        <p className="text-muted text-sm">
          O perfil do jogador agora está ativo e visível no ranking regional.
          Obrigado por apoiar o sonho dele!
        </p>
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className="bg-white rounded-xl border border-border p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Consentimento Negado</h2>
        <p className="text-muted text-sm">
          O perfil do jogador não será ativado.
          Se mudar de ideia, entre em contato conosco.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6 space-y-4">
      <h2 className="text-xl font-semibold text-center">Consentimento Parental</h2>

      {status === 'error' && (
        <div className="bg-red-50 text-error text-sm p-3 rounded-lg">
          {errorMsg}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-2">
        <p className="font-medium text-blue-800">O que é a GIE?</p>
        <p className="text-blue-700">
          A GIE (Game Intelligence Engine) é uma plataforma gratuita onde jovens jogadores
          de futebol criam um perfil com vídeos de jogos reais para serem vistos por clubes e scouts.
        </p>
      </div>

      <div className="text-sm space-y-2">
        <p className="font-medium">Ao aprovar, você concorda que:</p>
        <ul className="list-disc list-inside text-muted space-y-1">
          <li>O perfil do jogador será visível para clubes e scouts cadastrados</li>
          <li>Vídeos de jogos enviados pelo jogador poderão ser visualizados</li>
          <li>Nenhum contato direto será feito com o menor — tudo passa pelo responsável</li>
          <li>O perfil pode ser removido a qualquer momento</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleReject}
          loading={status === 'loading'}
          className="flex-1"
        >
          Negar
        </Button>
        <Button
          onClick={handleApprove}
          loading={status === 'loading'}
          className="flex-1"
        >
          Aprovar
        </Button>
      </div>
    </div>
  )
}

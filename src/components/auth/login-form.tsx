'use client'

import { useState } from 'react'
import { signIn } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn(email, password)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-2xl border border-border p-6 space-y-4">
      <h2 className="text-xl font-bold text-center">Entrar</h2>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded-xl">
          {error}
        </div>
      )}

      <Input
        id="email"
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        required
      />

      <Input
        id="password"
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Sua senha"
        required
      />

      <Button type="submit" loading={loading} className="w-full">
        Entrar
      </Button>

      <p className="text-center text-sm text-muted">
        Não tem conta?{' '}
        <Link href="/cadastro" className="text-primary font-medium hover:underline">
          Criar perfil
        </Link>
      </p>
    </form>
  )
}

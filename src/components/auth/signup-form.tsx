'use client'

import { useState, useMemo } from 'react'
import { signUp } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { POSITION_LIST } from '@/lib/constants/positions'
import { BRAZILIAN_STATES } from '@/lib/constants/regions'
import { isMinor } from '@/lib/utils/age'
import { signUpSchema } from '@/lib/utils/validation'
import Link from 'next/link'

const stateOptions = Object.entries(BRAZILIAN_STATES)
  .map(([code, name]) => ({ value: code, label: `${code} - ${name}` }))
  .sort((a, b) => a.label.localeCompare(b.label))

const positionOptions = POSITION_LIST.map((p) => ({
  value: p.code,
  label: p.name,
}))

export function SignUpForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    dateOfBirth: '',
    position: '',
    city: '',
    state: '',
    guardianName: '',
    guardianEmail: '',
    guardianRelationship: 'responsavel',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const needsConsent = useMemo(() => {
    if (!form.dateOfBirth) return false
    return isMinor(new Date(form.dateOfBirth))
  }, [form.dateOfBirth])

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')
    setErrors({})

    const result = signUpSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    const response = await signUp(result.data)
    if (response?.error) {
      setServerError(response.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 space-y-4">
      <h2 className="text-xl font-semibold text-center">Criar Perfil</h2>

      {serverError && (
        <div className="bg-red-50 text-error text-sm p-3 rounded-lg">
          {serverError}
        </div>
      )}

      <Input
        id="fullName"
        label="Nome completo"
        value={form.fullName}
        onChange={(e) => updateField('fullName', e.target.value)}
        error={errors.fullName}
        required
      />

      <Input
        id="email"
        label="E-mail"
        type="email"
        value={form.email}
        onChange={(e) => updateField('email', e.target.value)}
        error={errors.email}
        required
      />

      <Input
        id="dateOfBirth"
        label="Data de nascimento"
        type="date"
        value={form.dateOfBirth}
        onChange={(e) => updateField('dateOfBirth', e.target.value)}
        error={errors.dateOfBirth}
        required
      />

      <Select
        id="position"
        label="Posição principal"
        options={positionOptions}
        placeholder="Selecione sua posição"
        value={form.position}
        onChange={(e) => updateField('position', e.target.value)}
        error={errors.position}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="city"
          label="Cidade"
          value={form.city}
          onChange={(e) => updateField('city', e.target.value)}
          error={errors.city}
          required
        />
        <Select
          id="state"
          label="Estado"
          options={stateOptions}
          placeholder="UF"
          value={form.state}
          onChange={(e) => updateField('state', e.target.value)}
          error={errors.state}
          required
        />
      </div>

      <Input
        id="password"
        label="Senha"
        type="password"
        value={form.password}
        onChange={(e) => updateField('password', e.target.value)}
        placeholder="Mínimo 6 caracteres"
        error={errors.password}
        required
      />

      <Input
        id="confirmPassword"
        label="Confirmar senha"
        type="password"
        value={form.confirmPassword}
        onChange={(e) => updateField('confirmPassword', e.target.value)}
        error={errors.confirmPassword}
        required
      />

      {needsConsent && (
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-amber-800">
            Como você é menor de 18 anos, precisamos do consentimento de um responsável.
          </p>
          <Input
            id="guardianName"
            label="Nome do responsável"
            value={form.guardianName}
            onChange={(e) => updateField('guardianName', e.target.value)}
            error={errors.guardianName}
            required
          />
          <Input
            id="guardianEmail"
            label="E-mail do responsável"
            type="email"
            value={form.guardianEmail}
            onChange={(e) => updateField('guardianEmail', e.target.value)}
            error={errors.guardianEmail}
            required
          />
          <Select
            id="guardianRelationship"
            label="Parentesco"
            options={[
              { value: 'mae', label: 'Mãe' },
              { value: 'pai', label: 'Pai' },
              { value: 'responsavel', label: 'Responsável Legal' },
            ]}
            value={form.guardianRelationship}
            onChange={(e) => updateField('guardianRelationship', e.target.value)}
          />
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full">
        Criar meu perfil
      </Button>

      <p className="text-center text-sm text-muted">
        Já tem conta?{' '}
        <Link href="/entrar" className="text-primary font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  )
}

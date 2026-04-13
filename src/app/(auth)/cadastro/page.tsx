import { SignUpForm } from '@/components/auth/signup-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Criar Perfil',
}

export default function SignUpPage() {
  return <SignUpForm />
}

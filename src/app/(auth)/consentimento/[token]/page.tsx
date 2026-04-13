import { ConsentPage } from './consent-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consentimento Parental',
}

export default async function ParentalConsentPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  return <ConsentPage token={token} />
}

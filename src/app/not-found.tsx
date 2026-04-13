import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-6">⚽</div>
      <h1 className="text-4xl font-black mb-2">404</h1>
      <p className="text-muted mb-6">Essa página não existe. Pode ter saído de campo.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-primary text-background font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  )
}

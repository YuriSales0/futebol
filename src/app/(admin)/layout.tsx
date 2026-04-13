import { requireAdmin } from '@/lib/utils/roles'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/jogadores', label: 'Jogadores', icon: '⚽' },
  { href: '/admin/videos', label: 'Vídeos', icon: '🎬' },
  { href: '/admin/usuarios', label: 'Usuários', icon: '👥' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()
  if (!admin) redirect('/entrar')

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between h-14 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <span className="text-white text-xs font-black">A</span>
              </div>
              <span className="text-sm font-black">
                <span className="text-foreground">GIE</span>
                <span className="text-muted ml-1 font-semibold">Admin</span>
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1 ml-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs font-semibold text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-surface transition-colors"
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <Link href="/album" className="text-xs text-muted hover:text-primary transition-colors">
            Voltar ao app
          </Link>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="sm:hidden flex items-center gap-1 px-4 py-2 border-b border-border overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-xs font-semibold text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-surface transition-colors whitespace-nowrap"
          >
            <span className="mr-1">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  )
}

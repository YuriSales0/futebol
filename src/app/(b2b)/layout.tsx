import { requireScout } from '@/lib/utils/roles'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/catalogo', label: 'Catálogo', icon: '🔍' },
  { href: '/shortlists', label: 'Shortlists', icon: '📋' },
]

export default async function B2BLayout({ children }: { children: React.ReactNode }) {
  const scout = await requireScout()
  if (!scout) redirect('/entrar')

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between h-14 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/catalogo" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-black">G</span>
              </div>
              <span className="text-sm font-black">
                <span className="text-foreground">GIE</span>
                <span className="text-muted ml-1 font-semibold">Scout</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1 ml-6">
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
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-secondary/10 text-secondary border border-secondary/20 rounded-full px-2.5 py-1 font-bold">
              Scout
            </span>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  )
}

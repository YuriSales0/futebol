import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

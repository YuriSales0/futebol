export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center mx-auto mb-3">
            <span className="text-background text-lg font-black">G</span>
          </div>
          <h1 className="text-xl font-black text-primary">GIE</h1>
          <p className="text-xs text-muted mt-1">Game Intelligence Engine</p>
        </div>
        {children}
      </div>
    </div>
  )
}

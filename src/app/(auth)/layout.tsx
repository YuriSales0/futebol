export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">GIE</h1>
          <p className="text-sm text-muted mt-1">Game Intelligence Engine</p>
        </div>
        {children}
      </div>
    </div>
  )
}

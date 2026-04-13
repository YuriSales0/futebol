import Link from "next/link";

const DIMENSIONS = [
  { name: "Scanning", ref: "Xavi", color: "bg-blue-500" },
  { name: "Decisão", ref: "Messi", color: "bg-purple-500" },
  { name: "Off-Ball", ref: "Müller", color: "bg-emerald-500" },
  { name: "Orientação", ref: "Modrić", color: "bg-amber-500" },
  { name: "Antecipação", ref: "Rodri", color: "bg-red-500" },
  { name: "Resiliência", ref: "C. Ronaldo", color: "bg-orange-500" },
  { name: "Comunicação", ref: "T. Silva", color: "bg-cyan-500" },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_60%)]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Game Intelligence
            <br />
            <span className="text-emerald-200">Engine</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto">
            Monte seu álbum de figurinhas com as 7 dimensões da inteligência de
            jogo. Mostre seu talento com vídeos de jogos reais e entre no radar
            dos clubes.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center rounded-lg bg-white text-emerald-700 font-semibold px-8 py-3 text-lg hover:bg-emerald-50 transition-colors touch-target"
            >
              Criar meu perfil
            </Link>
            <Link
              href="/entrar"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 text-white font-semibold px-8 py-3 text-lg hover:bg-white/10 transition-colors touch-target"
            >
              Já tenho conta
            </Link>
          </div>
          <p className="mt-4 text-sm text-emerald-200">
            Gratuito para sempre. Para jogadores de 11 a 17 anos.
          </p>
        </div>
      </section>

      {/* 7 Dimensions */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          As 7 Dimensões da Inteligência de Jogo
        </h2>
        <p className="text-center text-muted mb-12 max-w-2xl mx-auto">
          Preencha cada slot do seu álbum com vídeos de jogos reais mostrando
          suas habilidades cognitivas no campo.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DIMENSIONS.map((dim, i) => (
            <div
              key={dim.name}
              className="rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-lg ${dim.color} flex items-center justify-center text-white font-bold text-sm`}
                >
                  D{i + 1}
                </div>
                <div>
                  <h3 className="font-semibold">{dim.name}</h3>
                  <p className="text-sm text-muted">Ref: {dim.ref}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="rounded-xl border-2 border-dashed border-border p-5 flex items-center justify-center">
            <p className="text-muted text-center text-sm">
              Preencha todas as 7 para completar seu álbum
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Crie seu perfil</h3>
              <p className="text-muted text-sm">
                Cadastre-se gratuitamente e preencha suas informações de
                jogador.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Envie seus vídeos</h3>
              <p className="text-muted text-sm">
                Faça upload de vídeos de jogos reais e selecione os lances para
                cada dimensão.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Entre no ranking</h3>
              <p className="text-muted text-sm">
                Complete seu álbum e apareça no ranking regional. Os top 5%
                ganham o selo Diamante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted">
          <p className="font-semibold text-foreground mb-1">
            GIE — Game Intelligence Engine
          </p>
          <p>
            Organizando a visibilidade do talento invisível do futebol
            brasileiro.
          </p>
        </div>
      </footer>
    </main>
  );
}

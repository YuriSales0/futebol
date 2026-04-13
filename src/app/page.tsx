import Link from "next/link";

const DIMENSIONS = [
  { name: "Scanning", ref: "Xavi", weight: "20%", color: "#448aff", desc: "Leitura do campo antes de receber" },
  { name: "Decisão", ref: "Messi", weight: "25%", color: "#b388ff", desc: "Melhor opção sob pressão" },
  { name: "Off-Ball", ref: "Müller", weight: "15%", color: "#69f0ae", desc: "Criação de espaços sem bola" },
  { name: "Orientação", ref: "Modrić", weight: "10%", color: "#ffd740", desc: "Corpo orientado ao receber" },
  { name: "Antecipação", ref: "Rodri", weight: "10%", color: "#ff5252", desc: "Interceptação antes da jogada" },
  { name: "Resiliência", ref: "C. Ronaldo", weight: "10%", color: "#ffab40", desc: "Performance após adversidade" },
  { name: "Comunicação", ref: "T. Silva", weight: "10%", color: "#18ffff", desc: "Organização do coletivo" },
];

const STATS = [
  { value: "57M", label: "Jovens no Nordeste" },
  { value: "7", label: "Dimensões cognitivas" },
  { value: "100%", label: "Gratuito para jogadores" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/50 via-background to-background" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
          {/* Grid overlay */}
          <div className="absolute inset-0 field-pattern opacity-50" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-surface-2 border border-border rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs text-muted font-medium">Pipeline de Talentos Invisíveis</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight">
            <span className="text-foreground">GAME</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-emerald-300 to-primary bg-clip-text text-transparent glow-text">
              INTELLIGENCE
            </span>
            <br />
            <span className="text-foreground">ENGINE</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Monte seu <span className="text-foreground font-semibold">álbum de figurinhas</span> com
            as 7 dimensões da inteligência de jogo. Mostre seu talento com
            <span className="text-primary font-semibold"> vídeos reais</span> e entre no radar dos clubes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cadastro"
              className="relative inline-flex items-center justify-center rounded-xl bg-primary text-background font-bold px-8 py-4 text-lg hover:bg-primary-dark transition-all pulse-cta touch-target"
            >
              Criar meu perfil
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/entrar"
              className="inline-flex items-center justify-center rounded-xl border border-border text-foreground font-semibold px-8 py-4 text-lg hover:bg-surface-2 transition-all touch-target"
            >
              Já tenho conta
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-black text-primary">{stat.value}</div>
                <div className="text-xs text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 Dimensions */}
      <section className="relative mx-auto max-w-5xl px-4 py-20 sm:py-32">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">As dimensões</span>
          <h2 className="text-3xl sm:text-4xl font-black mt-3">
            7 Dimensões da<br />
            <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              Inteligência de Jogo
            </span>
          </h2>
          <p className="text-muted mt-4 max-w-lg mx-auto">
            Cada slot do seu álbum representa uma habilidade cognitiva. Preencha com vídeos reais.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DIMENSIONS.map((dim, i) => (
            <div
              key={dim.name}
              className="group relative bg-surface border border-border rounded-2xl p-5 card-hover cursor-default"
            >
              {/* Colored top accent */}
              <div
                className="absolute top-0 left-6 right-6 h-0.5 rounded-full"
                style={{ backgroundColor: dim.color }}
              />
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg"
                  style={{
                    backgroundColor: dim.color,
                    boxShadow: `0 4px 20px ${dim.color}40`,
                  }}
                >
                  D{i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-foreground">{dim.name}</h3>
                    <span className="text-[10px] font-mono text-muted bg-surface-2 px-2 py-0.5 rounded-full">
                      {dim.weight}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">{dim.desc}</p>
                  <p className="text-[10px] mt-2 font-medium" style={{ color: dim.color }}>
                    Referência: {dim.ref}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* CTA card */}
          <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-3 animate-float">⚽</div>
            <p className="text-sm font-semibold text-foreground">Complete todas as 7</p>
            <p className="text-xs text-muted mt-1">e entre no ranking regional</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-20 sm:py-32">
        <div className="absolute inset-0 bg-surface" />
        <div className="relative mx-auto max-w-5xl px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">Como funciona</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3">
              3 passos para entrar<br />
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                no radar dos clubes
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Crie seu perfil",
                desc: "Cadastro gratuito. Preencha sua posição, cidade e região. Se menor de 18, um responsável autoriza.",
                icon: "👤",
              },
              {
                step: "02",
                title: "Envie seus vídeos",
                desc: "Faça upload de vídeos de jogos reais. Selecione trechos que demonstrem cada dimensão.",
                icon: "🎬",
              },
              {
                step: "03",
                title: "Entre no ranking",
                desc: "Complete seu álbum e suba no ranking regional. Top 5% ganham selo Diamante.",
                icon: "💎",
              },
            ].map((item) => (
              <div key={item.step} className="relative bg-surface-2 border border-border rounded-2xl p-6 card-hover">
                <span className="text-5xl font-black text-border">{item.step}</span>
                <div className="text-3xl mt-2">{item.icon}</div>
                <h3 className="font-bold text-lg mt-3 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confidence Layer */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:py-32">
        <div className="bg-surface border border-border rounded-3xl p-8 sm:p-12">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Confidence Layer</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-3">
                Transparência<br />total
              </h2>
              <p className="text-muted mt-4 leading-relaxed">
                Todo perfil carrega um índice de confiança visível. Clubes sabem
                exatamente a qualidade dos dados antes de investir tempo.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Fonte do vídeo", value: 75, color: "#448aff" },
                { label: "Validação externa", value: 40, color: "#b388ff" },
                { label: "Recência", value: 90, color: "#69f0ae" },
                { label: "Tamanho da amostra", value: 60, color: "#ffd740" },
                { label: "Consistência", value: 85, color: "#18ffff" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted">{item.label}</span>
                    <span className="font-mono font-bold" style={{ color: item.color }}>{item.value}%</span>
                  </div>
                  <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative text-center mx-auto max-w-2xl px-4">
          <h2 className="text-3xl sm:text-5xl font-black">
            Seu talento merece<br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ser visto
            </span>
          </h2>
          <p className="text-muted mt-4 text-lg">
            Gratuito para sempre. Para jogadores de 11 a 17 anos do Brasil inteiro.
          </p>
          <Link
            href="/cadastro"
            className="inline-flex items-center justify-center rounded-xl bg-primary text-background font-bold px-10 py-4 text-lg mt-8 hover:bg-primary-dark transition-all pulse-cta touch-target"
          >
            Começar agora
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted">
          <p className="font-bold text-foreground mb-1">GIE — Game Intelligence Engine</p>
          <p>Organizando a visibilidade do talento invisível do futebol brasileiro.</p>
        </div>
      </footer>
    </main>
  );
}

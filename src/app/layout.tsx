import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GIE - Game Intelligence Engine",
    template: "%s | GIE",
  },
  description:
    "A plataforma mais eficiente para jovens talentos do futebol brasileiro. Monte seu álbum de figurinhas com as 7 dimensões da inteligência de jogo.",
  keywords: ["futebol", "talentos", "scouting", "inteligência de jogo", "base", "jovens"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GIE",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}

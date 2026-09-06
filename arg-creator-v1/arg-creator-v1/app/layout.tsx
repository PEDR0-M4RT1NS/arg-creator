import "./globals.css";

export const metadata = {
  title: "MY BOO // ARG CREATOR",
  description: "Creator local de fases para uma ARG.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

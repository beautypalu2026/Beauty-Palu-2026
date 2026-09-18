import "./globals.css";

export const metadata = {
  title: "Beauty Palu 2026 — Event Management",
  description: "Event management dashboard untuk Beauty Palu 2026"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body>{children}</body></html>;
}
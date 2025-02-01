export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-dvh border border-slate-900">{children}</div>;
}

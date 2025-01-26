export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="h-dvh border border-slate-900">{children}</div>;
}

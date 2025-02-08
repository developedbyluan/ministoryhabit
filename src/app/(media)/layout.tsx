export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="bg-slate-400">{children}</div>;
}

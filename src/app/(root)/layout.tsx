export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="max-w-xl mx-auto flex flex-col h-screen">
      {children}
    </div>
  );
}

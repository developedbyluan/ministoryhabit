export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto flex flex-col min-h-screen">
      {children}
    </div>
  );
}

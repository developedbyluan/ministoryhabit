export default function RootLayout({children} : Readonly<{children: React.ReactNode}>) {
    return(
        <div className="flex flex-col h-screen border-2 border-red-400">
            {children}
        </div>
    )
}
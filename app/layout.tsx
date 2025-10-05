// budgetly/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { SyncProvider } from '@/components/providers/sync-provider'
import { BootstrapProvider } from '@/components/providers/bootstrap-provider'
import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/ui/toaster'
import { InstallPrompt } from '@/components/install-prompt'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Budgetly - Personal Budget Manager',
  description: 'A local-first personal budget manager with offline capabilities',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <SyncProvider>
              <BootstrapProvider>
                <div className="min-h-screen bg-background">
                  <Header />
                  <main className="pb-20">{children}</main>
                  <InstallPrompt />
                  <Toaster />
                </div>
              </BootstrapProvider>
            </SyncProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'
import { Inter } from 'next/font/google'
import Link from "next/link";

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
      <header>
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <Link href="/" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Поликлиника</span>
            </Link>
          </div>
        </nav>
      </header>
      <main>
        <aside id="default-sidebar" className="fixed top-12 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/doctors" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="ms-3">Врачи</span>
                </Link>
              </li>
              <li>
                <Link href="/specializations" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="ms-3">Специализации</span>
                </Link>
              </li>
              <li>
                <Link href="/patients" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="ms-3">Пациенты</span>
                </Link>
              </li>
              <li>
                <Link href="/appointment-schedule" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="ms-3">График приема</span>
                </Link>
              </li>
              <li>
                <Link href="/visits" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="ms-3">Визиты</span>
                </Link>
              </li>
              <li>
                <Link href="/diagnoses" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="ms-3">Диагнозы</span>
                </Link>
              </li>
              <li>
                <Link href="/medical-treatments" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="ms-3">Лечебные процедуры</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>
        <div className="p-4 sm:ml-64">
          {children}
        </div>
      </main>
      </body>
    </html>
  )
}

import './globals.css'
import { Inter, Ubuntu_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const ubuntuMono = Ubuntu_Mono({ subsets: ['latin'], weight: '400', variable: '--font-ubuntu' })

export const metadata = {
  title: 'Globo - Summary',
  description: 'App para geração de resumos de notícias',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${ubuntuMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}

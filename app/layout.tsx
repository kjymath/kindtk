import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "수학탐구교실",
  description: "생각하는 힘을 키우는 수학탐구교실",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-800 tracking-tight`}>
        {/* Header 영역 - 반투명 효과 및 둥근 그림자 적용 */}
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-gray-100/50 shadow-sm transition-all duration-300">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg tracking-tight text-gray-900 cursor-pointer">
              친절한 강선생의 <span className="text-blue-500">수학탐구교실</span>
            </Link>
            {/* Navigation - 차후 메뉴 추가 가능 */}
            <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-blue-500 transition-colors">소개</Link>
              <Link href="/" className="hover:text-blue-500 transition-colors">학습 자료</Link>
              <Link href="/qna" className="hover:text-blue-500 transition-colors text-blue-500 font-semibold">질문 게시판</Link>
            </nav>
          </div>
        </header>

        {/* Main Content 영역 */}
        <main className="min-h-screen flex flex-col items-center pt-20 pb-12 px-6 sm:px-8 selection:bg-blue-100 selection:text-blue-900">
          <div className="w-full max-w-5xl flex-grow flex flex-col">
            {children}
          </div>
        </main>

        {/* Footer 영역 */}
        <footer className="w-full border-t border-gray-100 bg-white/50 py-12 px-6 mt-auto">
          <div className="max-w-5xl mx-auto text-center text-sm text-gray-400 font-medium">
            © {new Date().getFullYear()} 친절한 강선생의 수학탐구교실. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}

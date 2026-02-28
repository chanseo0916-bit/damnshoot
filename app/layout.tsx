import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Jua } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import IdlePopup from "@/components/ui/IdlePopup";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jua = Jua({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "AMU — 뭐 먹을지 못 정하겠어?",
  description:
    "결정장애 끝! 룰렛, 제비뽑기, 밸런스게임, 만다라트까지. AMU가 대신 골라줄게.",
  keywords: ["AMU", "음식 결정", "점심 메뉴", "랜덤 음식", "음식 추천", "결정장애"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${plusJakarta.variable} ${jua.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <ToastProvider>
              {children}
              <IdlePopup />
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

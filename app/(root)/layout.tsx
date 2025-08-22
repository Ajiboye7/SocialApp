import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { dark } from "@clerk/themes";

import TopBar from "@/components/shared/TopBar";
import BottomBar from "@/components/shared/BottomBar";
import LeftSideBar from "@/components/shared/LeftSideBar";
import RightSideBar from "@/components/shared/RightSideBar";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social App",
  description: "A Next.js 15 Meta Social application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <TopBar />
          <main className="flex">
            <LeftSideBar />

            <section className="bg-dark-1 flex-1 min-h-screen pt-30 px-10 lg:px-20 pb-20 ">
              <div className="mx-auto w-full max-w-4xl">{children} </div>
            </section>

            <RightSideBar />
          </main>

          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}

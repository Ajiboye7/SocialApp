import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

import "../globals.css";
import { dark } from "@clerk/themes";

import TopBar from "@/components/shared/TopBar";
import BottomBar from "@/components/shared/BottomBar";
import LeftSideBar from "@/components/shared/LeftSideBar";
import RightSideBar from "@/components/shared/RightSideBar";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import ReduxProvider from "@/components/ReduxProvider";
import Loader from "@/components/Loader";
import { Toaster } from "@/components/ui/sonner";
import { AuthGuard } from "@/components/AuthGuard";
const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
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
    <ReduxProvider>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Loader />

            <TopBar />
            <main className="flex">
              <LeftSideBar />
              <AuthGuard>
                <section className="bg-dark-1 flex-1 min-h-screen pt-30 px-10 lg:px-20 pb-20 ">
                  <div className="mx-auto w-full max-w-4xl">{children} </div>
                </section>
              </AuthGuard>

              <RightSideBar />
            </main>

            <BottomBar />
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </ReduxProvider>
  );
}

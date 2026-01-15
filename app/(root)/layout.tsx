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
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads application",
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
            className={inter.className}
          >
            <Loader />

            <TopBar />
            <main className='flex flex-row'>
              <LeftSideBar />
              <AuthGuard>
                <section className='main-container'>
                     <div className='w-full max-w-4xl'>{children}</div>
                </section>
              </AuthGuard>

              <RightSideBar />
            </main>

            <BottomBar />
            <Toaster
        theme="light"
        richColors
        position="top-right"
        toastOptions={{
          classNames: {
            toast: "bg-[#0e0e12] border border-gray-700 text-white",
            success: "border-green-500",
            error: "border-red-500",
            info: "border-blue-500",
          },
        }}
      />
          </body>
        </html>
      </ClerkProvider>
    </ReduxProvider>
  );
}

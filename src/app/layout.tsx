import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Player from "@/components/Player";
import RightSidebar from "@/components/RightSidebar";
import "./globals.css";
import LeftSidebar from "@/components/LeftSidebar";
import { PlaybackProvider } from "@/context/PlaybackContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Music streaming UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >

        <PlaybackProvider>
        {/* Top Navbar */}
        <header className="fixed top-0 left-0 w-full h-16 z-50">
          <Navbar />
        </header>

        {/* Main Layout */}
        <main className="pt-16 pb-20 h-screen flex overflow-hidden">
          {/* Left Sidebar */}
            <LeftSidebar />
          {/* Center Content */}
          <section className="flex-1 h-full overflow-auto overscroll-contain px-4 rounded-xl">
            {children}
          </section>
          {/* Right Sidebar */}
            <RightSidebar />
        </main>
        {/* Bottom Player */}
        <footer className="fixed bottom-0 left-0 w-full h-20 z-50">
          <Player />
        </footer>

        </PlaybackProvider>
      </body>
    </html>
  );
}

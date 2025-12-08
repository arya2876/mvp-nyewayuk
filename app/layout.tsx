import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import Navbar from "@/components/navbar";
import Providers from "@/components/Provider";
import Footer from "@/components/Footer";

const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NyewaYuk - Sewa Aman, Hidup Hemat",
  description:
    "Platform peer-to-peer rental terpercaya di Indonesia. Sewa barang yang Anda butuhkan atau sewakan barang yang Anda miliki dengan aman menggunakan NyewaGuard AI.",
  icons: {
    icon: [
      { url: "/images/Logo Ny.png", type: "image/png" },
    ],
    shortcut: "/images/Logo Ny.png",
    apple: "/images/Logo Ny.png",
    other: {
      rel: "icon",
      url: "/images/Logo Ny.png",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/Logo Ny.png" type="image/png" />
        <link rel="shortcut icon" href="/images/Logo Ny.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/Logo Ny.png" />
      </head>
      <body className={`${nunito.className} antialiased`} suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="pb-16 pt-[80px]">{children}</main>
          <Footer />
        </Providers>
      </body>
      <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID || ""} />
    </html>
  );
}

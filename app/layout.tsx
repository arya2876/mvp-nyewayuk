import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import Navbar from "@/components/navbar";
import Providers from "@/components/Provider";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";

const notoSans = Noto_Sans({ 
  subsets: ["latin-ext", "vietnamese"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "RENLE | Sewa Aman, Aset Cuan",
  description:
    "Platform peer-to-peer rental terpercaya di Indonesia. Sewa barang yang Anda butuhkan atau sewakan barang yang Anda miliki dengan aman menggunakan RenleGuard AI.",
  icons: {
    icon: [
      { url: "/images/logo-renle-white.png", type: "image/png" },
    ],
    shortcut: "/images/logo-renle-white.png",
    apple: "/images/logo-renle-white.png",
    other: {
      rel: "icon",
      url: "/images/logo-renle-white.png",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo-renle-white.png" type="image/png" />
        <link rel="shortcut icon" href="/images/logo-renle-white.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo-renle-white.png" />
      </head>
      <body className={`${notoSans.className} antialiased bg-neutral-900 text-gray-100`} suppressHydrationWarning>
        <Providers>
          <ToastProvider>
            <Navbar />
            <main className="pb-16 pt-[80px]">{children}</main>
            <Footer />
          </ToastProvider>
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
      {process.env.GA_MEASUREMENT_ID && <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID} />}
    </html>
  );
}

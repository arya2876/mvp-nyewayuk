import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import Navbar from "@/components/navbar";
import Providers from "@/components/Provider";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "NyewaYuk - Sewa Aman, Hidup Hemat",
  description:
    "Platform peer-to-peer rental terpercaya di Indonesia. Sewa barang yang Anda butuhkan atau sewakan barang yang Anda miliki dengan aman menggunakan NyewaGuard AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
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

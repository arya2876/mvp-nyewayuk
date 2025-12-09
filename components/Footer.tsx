'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from './ThemeProvider';

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`pt-16 pb-8 text-white ${isDark ? 'bg-[#121212]' : 'bg-[#0054A6]'}`}>
      <div className="mx-auto max-w-6xl px-6">
        {/* Grid 4 kolom */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Kolom 1: Logo Besar */}
          <div className="space-y-4">
            <Link href="/" className="inline-block relative h-[60px] w-[160px]">
              <Image
                src="/images/Logo Ny.png"
                alt="NyewaYuk Logo"
                fill
                className="object-contain object-left brightness-0 invert"
                unoptimized
              />
            </Link>
            <p className="text-sm text-white/80 leading-relaxed">
              Sewa aman, hidup hemat. Platform peer-to-peer rental terpercaya di Indonesia.
            </p>
          </div>

          {/* Kolom 2: Tentang Kami */}
          <div>
            <h4 className="mb-4 text-base font-bold">Tentang Kami</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/tentang" className="text-white/80 hover:text-white transition">Tentang</Link></li>
              <li><Link href="/jaminan" className="text-white/80 hover:text-white transition">Jaminan</Link></li>
              <li><Link href="/faq" className="text-white/80 hover:text-white transition">FAQ</Link></li>
              <li><Link href="/syarat-ketentuan" className="text-white/80 hover:text-white transition">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Lokasi/Kategori */}
          <div>
            <h4 className="mb-4 text-base font-bold">Jelajahi</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/area" className="text-white/80 hover:text-white transition">Area Layanan</Link></li>
              <li><Link href="/blog" className="text-white/80 hover:text-white transition">Blog</Link></li>
              <li><Link href="/kategori" className="text-white/80 hover:text-white transition">Semua Kategori</Link></li>
              <li><Link href="/cara-kerja" className="text-white/80 hover:text-white transition">Cara Kerja</Link></li>
            </ul>
          </div>

          {/* Kolom 4: App Store & Sosmed */}
          <div>
            <h4 className="mb-4 text-base font-bold">Download Aplikasi</h4>
            <div className="space-y-3">
              {/* App Store Button */}
              <a 
                href="#" 
                className="block w-full hover:opacity-80 transition"
                aria-label="Download on App Store"
              >
                <div className="flex items-center gap-3 rounded-lg border-2 border-white px-4 py-2.5">
                  <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-white text-left">
                    <div className="text-[10px] leading-tight">Download on the</div>
                    <div className="font-semibold text-lg leading-tight">App Store</div>
                  </div>
                </div>
              </a>
              
              {/* Google Play Button */}
              <a 
                href="#" 
                className="block w-full hover:opacity-80 transition"
                aria-label="Get it on Google Play"
              >
                <div className="flex items-center gap-3 rounded-lg border-2 border-white px-4 py-2.5">
                  <svg className="w-9 h-9" viewBox="0 0 512 512">
                    <path fill="#32BBFF" d="M61.9 34.3L339 199.8l-71.8 72.1L61.9 34.3z"/>
                    <path fill="#32BBFF" d="M278.6 284.5l71.8 72.1-288.5 165.5 216.7-237.6z"/>
                    <path fill="#32BBFF" d="M390.8 224.2l74.6 42.9c21.7 12.5 21.7 32.8 0 45.2l-74.6 42.9-83.6-83.6 83.6-83.6 266.2 0z"/>
                    <path fill="#32BBFF" d="M390.8 224.2l-83.6 83.6-39.6-39.7 39.6-39.7 83.6-4.2z"/>
                  </svg>
                  <div className="text-white text-left">
                    <div className="text-[10px] leading-tight">GET IT ON</div>
                    <div className="font-semibold text-lg leading-tight">Google Play</div>
                  </div>
                </div>
              </a>
              
              {/* Social Media Icons */}
              <div className="flex items-center gap-4 pt-4">
                {/* Instagram */}
                <Link href="#" aria-label="Instagram" className="text-white hover:text-white/80 transition">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </Link>
                
                {/* TikTok */}
                <Link href="#" aria-label="TikTok" className="text-white hover:text-white/80 transition">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </Link>
                
                {/* X (Twitter) */}
                <Link href="#" aria-label="X" className="text-white hover:text-white/80 transition">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/70">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p>© {new Date().getFullYear()} NyewaYuk. Semua hak dilindungi.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white transition">Kebijakan Privasi</Link>
              <Link href="/syarat-ketentuan" className="hover:text-white transition">Syarat</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

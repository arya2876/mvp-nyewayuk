'use client';

import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200 text-gray-800">
      <div className="mx-auto max-w-6xl px-6">
        {/* Grid 4 kolom */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Kolom 1: Logo + Slogan */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-3 py-2 text-emerald-900">
                <span className="font-semibold">NyewaYuk</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600">Sewa aman, hidup hemat.</p>
          </div>

          {/* Kolom 2: NyewaYuk */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">NyewaYuk</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tentang" className="hover:text-gray-900">Tentang Kami</Link></li>
              <li><Link href="/blog" className="hover:text-gray-900">Blog</Link></li>
              <li><Link href="/karir" className="hover:text-gray-900">Karir</Link></li>
              <li><Link href="/press" className="hover:text-gray-900">Press</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Bantuan */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Bantuan</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cara-kerja" className="hover:text-gray-900">Cara Kerja</Link></li>
              <li><Link href="/nyewaguard-ai" className="hover:text-gray-900">NyewaGuard AI</Link></li>
              <li><Link href="/pusat-bantuan" className="hover:text-gray-900">Pusat Bantuan</Link></li>
              <li><Link href="/syarat-ketentuan" className="hover:text-gray-900">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          {/* Kolom 4: Download & Sosmed */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Download & Sosial</h4>
            <div className="space-y-3">
              {/* Placeholder badges */}
              <button className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm shadow-sm transition hover:shadow-md">
                Download on the App Store
              </button>
              <button className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm shadow-sm transition hover:shadow-md">
                Get it on Google Play
              </button>
              <div className="flex items-center gap-4 pt-2">
                <Link href="#" aria-label="Instagram" className="text-gray-600 hover:text-gray-900">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" aria-label="Twitter" className="text-gray-600 hover:text-gray-900">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" aria-label="Facebook" className="text-gray-600 hover:text-gray-900">
                  <Facebook className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-600">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p>© {new Date().getFullYear()} NyewaYuk. Semua hak dilindungi.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-gray-900">Kebijakan Privasi</Link>
              <Link href="/syarat-ketentuan" className="hover:text-gray-900">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

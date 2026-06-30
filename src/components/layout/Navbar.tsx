'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ExternalLink, Menu, Search, X } from 'lucide-react';

import { Link, usePathname } from '@/navigation';
import { LanguageSwitcher } from '@/components/registration/LanguageSwitcher';
import { cn } from '@/lib/utils';
import { CONTACT_INFO } from '@/lib/constants/contact';

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-500',
        scrolled ? 'bg-white/80 py-2 shadow-glass backdrop-blur-xl sm:py-3' : 'bg-transparent py-3 sm:py-5'
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2 sm:gap-3">
          <Image
            src="/images/logo.png"
            alt="ZTF University Institute"
            width={44}
            height={44}
            className="h-9 w-9 rounded-full object-cover transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11"
          />
          <div className="hidden sm:block">
            <p className={cn('text-sm font-bold leading-tight transition-colors sm:text-base', scrolled ? 'text-ztf-navy' : 'text-white')}>
              ZTF University Institute
            </p>
            <p className={cn('text-[10px] transition-colors sm:text-xs', scrolled ? 'text-gray-500' : 'text-white/60')}>
              Online Registration Portal
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
          <a
            href={CONTACT_INFO.mainSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors',
              scrolled ? 'text-gray-600 hover:text-ztf-navy' : 'text-white/80 hover:text-white'
            )}
          >
            {t('back_to_main')}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Link
            href="/status"
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors',
              scrolled ? 'text-gray-600 hover:text-ztf-navy' : 'text-white/80 hover:text-white'
            )}
          >
            <Search className="h-3.5 w-3.5" />
            {t('status')}
          </Link>
          <LanguageSwitcher
            className={cn(!scrolled && 'glass-card-dark text-white/80 hover:bg-white/10 hover:text-white')}
          />
          <Link
            href="/register/1"
            className="active:scale-95 rounded-xl bg-gradient-to-r from-ztf-gold to-ztf-goldLight px-5 py-2.5 text-sm font-bold text-ztf-navyDeep transition-all duration-300 hover:scale-105 hover:shadow-glow-gold"
          >
            {t('apply_now')}
          </Link>
        </nav>

        <button
          type="button"
          className={cn('rounded-lg p-2 transition-colors lg:hidden', scrolled ? 'text-ztf-navy' : 'text-white')}
          aria-label="Menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="glass-card animate-slide-up mx-4 mt-2 space-y-1 rounded-2xl px-5 py-5 shadow-glass lg:hidden">
          <a
            href={CONTACT_INFO.mainSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between border-b border-gray-100 py-3 text-gray-700"
          >
            {t('back_to_main')} <ExternalLink className="h-4 w-4" />
          </a>
          <Link href="/status" className="flex items-center gap-2 border-b border-gray-100 py-3 text-gray-700">
            <Search className="h-4 w-4" />
            {t('status')}
          </Link>
          <Link
            href="/register/1"
            className="mt-3 block rounded-xl bg-gradient-to-r from-ztf-gold to-ztf-goldLight py-3.5 text-center font-bold text-ztf-navyDeep"
          >
            {t('apply_now')}
          </Link>
          <div className="flex justify-center pt-2">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}

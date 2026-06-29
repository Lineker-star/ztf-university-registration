'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ExternalLink, GraduationCap, Menu, Search, X } from 'lucide-react';

import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/registration/LanguageSwitcher';
import { cn } from '@/lib/utils';
import { CONTACT_INFO } from '@/lib/constants/contact';

export function Navbar() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow',
        scrolled ? 'border-gray-100 shadow-sm' : 'border-transparent'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-ztf-navy">
          <GraduationCap className="h-7 w-7 text-ztf-gold" />
          <span className="text-lg leading-tight">ZTF University Institute</span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <a
            href={CONTACT_INFO.mainSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-ztf-navy"
          >
            {t('back_to_main')}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Link
            href="/status"
            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-ztf-navy"
          >
            <Search className="h-3.5 w-3.5" />
            {t('status')}
          </Link>
          <LanguageSwitcher />
          <Button asChild size="sm" variant="secondary">
            <Link href="/register/1">{t('apply_now')}</Link>
          </Button>
        </nav>

        <button
          type="button"
          className="p-2 text-ztf-navy md:hidden"
          aria-label="Menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="space-y-3 border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <a
            href={CONTACT_INFO.mainSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border-b border-gray-100 py-2 text-gray-700"
          >
            {t('back_to_main')} <ExternalLink className="h-4 w-4" />
          </a>
          <Link href="/status" className="block border-b border-gray-100 py-2 text-gray-700">
            {t('status')}
          </Link>
          <Link
            href="/register/1"
            className="block rounded-lg bg-ztf-navy py-3 text-center font-semibold text-white"
          >
            {t('apply_now')}
          </Link>
          <div className="flex justify-center pt-1">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}

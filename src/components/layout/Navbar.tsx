'use client';

import { useTranslations } from 'next-intl';
import { GraduationCap, ExternalLink } from 'lucide-react';

import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/registration/LanguageSwitcher';

export function Navbar() {
  const t = useTranslations('nav');
  const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://www.ztfuniversity.com';

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-ztf-navy">
          <GraduationCap className="h-7 w-7 text-ztf-gold" />
          <span className="text-lg leading-tight">ZTF University Institute</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <a
            href={mainSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 text-sm font-medium text-gray-600 hover:text-ztf-navy sm:flex"
          >
            {t('back_to_main')}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Link href="/status" className="text-sm font-medium text-gray-600 hover:text-ztf-navy">
            {t('status')}
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/login">{t('login')}</Link>
          </Button>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}

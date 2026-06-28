'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';

import { usePathname, useRouter } from '@/navigation';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function toggleLocale() {
    const nextLocale = locale === 'en' ? 'fr' : 'en';
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ztf-locale', nextLocale);
    }
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleLocale} className={className}>
      <Globe className="h-4 w-4" />
      {t('language')}
    </Button>
  );
}

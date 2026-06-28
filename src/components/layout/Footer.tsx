import { useTranslations } from 'next-intl';
import { Mail, MapPin, Phone } from 'lucide-react';

import { Link } from '@/navigation';

export function Footer() {
  const t = useTranslations('common');
  const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://www.ztfuniversity.com';

  return (
    <footer className="border-t border-gray-100 bg-ztf-navyDark text-gray-300">
      <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h3 className="mb-3 text-lg font-bold text-white">ZTF University Institute</h3>
          <p className="text-sm text-gray-400">
            Building futures through quality education in both the Anglophone and Francophone systems.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ztf-gold">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-white">
                Register
              </Link>
            </li>
            <li>
              <Link href="/status" className="hover:text-white">
                Check Status
              </Link>
            </li>
            <li>
              <a href={mainSiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                www.ztfuniversity.com
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ztf-gold">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-ztf-gold" /> Bertoua, Cameroon
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-ztf-gold" /> +237 6XX XXX XXX
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-ztf-gold" /> admissions@ztfuniversity.com
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">{t('copyright')}</div>
    </footer>
  );
}

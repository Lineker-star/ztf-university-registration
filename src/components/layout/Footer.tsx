import { useTranslations } from 'next-intl';
import { GraduationCap, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import { Link } from '@/navigation';
import { CONTACT_INFO } from '@/lib/constants/contact';

export function Footer() {
  const t = useTranslations('common');
  const tNav = useTranslations('nav');
  const tContact = useTranslations('contact');
  const tHome = useTranslations('home');

  return (
    <footer className="bg-ztf-navyDeep text-white">
      <div className="bg-ztf-navy py-4">
        <div className="container flex flex-wrap items-center justify-center gap-4 sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/90">
            <Phone className="h-4 w-4 shrink-0 text-ztf-gold" />
            {CONTACT_INFO.phones.join(' | ')}
          </div>
          <div className="flex items-center gap-2 text-sm text-white/90">
            <Mail className="h-4 w-4 shrink-0 text-ztf-gold" />
            {CONTACT_INFO.email}
          </div>
          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-green-700"
          >
            <MessageCircle className="h-4 w-4" />
            {tContact('whatsapp')}
          </a>
        </div>
      </div>

      <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-ztf-gold" />
            <div>
              <p className="font-bold leading-tight">ZTF University Institute</p>
              <p className="text-xs text-white/60">Institut Universitaire ZTF</p>
            </div>
          </div>
          <p className="mb-4 text-sm italic text-white/60">
            &ldquo;Empowering World Innovators and Leaders for Global Impact&rdquo;
          </p>
          <p className="text-xs text-white/40">{tContact('address_value')}</p>
          <p className="mt-1 text-xs text-white/40">{tHome('open_hours')}</p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ztf-gold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link href="/" className="hover:text-white">
                {tNav('home')}
              </Link>
            </li>
            <li>
              <Link href="/register/1" className="hover:text-white">
                {tNav('apply_now')}
              </Link>
            </li>
            <li>
              <Link href="/status" className="hover:text-white">
                {tNav('status')}
              </Link>
            </li>
            <li>
              <a
                href={CONTACT_INFO.mainSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ztf-gold"
              >
                www.ztfuniversity.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ztf-gold">{tHome('programmes')}</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {['HND', 'BTech', 'MTech', 'BTS', 'Licence', 'Master'].map((p) => (
              <li key={p} className="flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5 text-ztf-gold" /> {p}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ztf-gold">{tContact('title')}</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ztf-gold" />
              {tContact('address_value')}
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ztf-gold" />
              <div>
                {CONTACT_INFO.phones.map((phone) => (
                  <div key={phone}>{phone}</div>
                ))}
              </div>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-ztf-gold" />
              {CONTACT_INFO.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">{t('copyright')}</div>
    </footer>
  );
}

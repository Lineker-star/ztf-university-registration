import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  UploadCloud,
  Users,
} from 'lucide-react';

import { Link } from '@/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ANGLOPHONE_PROGRAMMES, FRANCOPHONE_PROGRAMMES } from '@/lib/constants/programmes';
import { CONTACT_INFO } from '@/lib/constants/contact';
import { HIGHER_INSTITUTES, STANDALONE_SCHOOL, TOTAL_FIELDS } from '@/lib/constants/institutes';

const STEP_ICONS = [Users, GraduationCap, ClipboardCheck, UploadCloud, Users, CheckCircle2];
const REQUIREMENT_KEYS = ['hnd', 'btech', 'mtech', 'bts', 'licence', 'master'] as const;

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const isFr = locale === 'fr';
  const t = useTranslations('home');
  const tContact = useTranslations('contact');

  const anglophoneEntries = Object.entries(ANGLOPHONE_PROGRAMMES);
  const francophoneEntries = Object.entries(FRANCOPHONE_PROGRAMMES);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-background.jpg"
              alt="ZTF University Institute"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ztf-navyDeep/85 via-ztf-navy/85 to-ztf-navyDeep/90" />
            <div className="absolute inset-0 bg-mesh-gradient opacity-60 mix-blend-overlay" />
          </div>

          <div className="pointer-events-none absolute left-[10%] top-1/4 h-72 w-72 rounded-full bg-ztf-gold/20 blur-[100px] animate-float" />
          <div className="pointer-events-none absolute bottom-1/4 right-[10%] h-96 w-96 rounded-full bg-ztf-glow/20 blur-[120px] animate-float-delayed" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ztf-gold/5 blur-[150px] animate-glow-pulse" />

          <div className="container relative z-10 py-28 text-center sm:py-32">
            <div className="mx-auto max-w-3xl">
              <span className="glass-card-dark mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-ztf-goldLight sm:mb-8 sm:px-5 sm:text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ztf-gold opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-ztf-gold" />
                </span>
                {t('subtitle')}
              </span>

              <div className="mb-6 flex justify-center sm:mb-8">
                <div className="relative">
                  <div className="absolute inset-0 scale-110 animate-glow-pulse rounded-full bg-ztf-gold/30 blur-2xl" />
                  <Image
                    src="/images/logo.png"
                    alt="ZTF University Institute Seal"
                    width={110}
                    height={110}
                    priority
                    className="relative h-20 w-20 rounded-full object-cover drop-shadow-[0_0_30px_rgba(201,168,76,0.4)] sm:h-28 sm:w-28"
                  />
                </div>
              </div>

              <h1 className="mb-3 text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:mb-4 sm:text-6xl sm:leading-[1.05] md:text-7xl">
                {t('title')}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base text-blue-100 sm:text-lg">{t('description')}</p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:gap-4">
                <Link
                  href="/register/1"
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-ztf-gold to-ztf-goldLight px-8 py-3.5 text-base font-bold text-ztf-navyDeep shadow-glow-gold transition-all duration-300 hover:scale-[1.03] hover:from-ztf-goldLight hover:to-ztf-gold active:scale-95 sm:w-auto sm:px-10 sm:py-4 sm:text-lg"
                >
                  <GraduationCap className="h-5 w-5" />
                  {t('start_registration')}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/status"
                  className="glass-card-dark glow-ring flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-white/10 active:scale-95 sm:w-auto sm:py-4 sm:text-lg"
                >
                  <Search className="h-5 w-5" />
                  {t('check_status')}
                </Link>
              </div>

              <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:gap-4">
                {[
                  { value: String(HIGHER_INSTITUTES.length), label: t('higher_institutes') },
                  { value: String(TOTAL_FIELDS), label: t('fields_specialties') },
                  { value: '2026', label: t('academic_year_label') },
                  { value: '2', label: t('languages_label') },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="glass-card-dark flex min-h-[72px] flex-col justify-center rounded-xl p-2.5 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 sm:min-h-[88px] sm:rounded-2xl sm:p-4"
                  >
                    <p className="text-xl font-bold text-ztf-goldLight sm:text-2xl">{stat.value}</p>
                    <p className="mt-1 text-[10px] leading-tight text-white/70 sm:text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/40 sm:bottom-8">
            <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </section>

        {/* Steps overview */}
        <section className="bg-white py-16">
          <div className="container">
            <h2 className="text-center text-2xl font-bold text-ztf-navy sm:text-3xl">{t('steps_title')}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(['step1', 'step2', 'step3', 'step4', 'step5', 'step6'] as const).map((key, index) => {
                const Icon = STEP_ICONS[index];
                return (
                  <Card key={key} className="border-gray-100">
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-ztf-navy">
                        {index + 1}
                      </div>
                      <div>
                        <Icon className="mb-2 h-5 w-5 text-ztf-gold" />
                        <p className="font-semibold text-gray-800">{t(key)}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Programmes */}
        <section className="bg-gray-50 py-16">
          <div className="container">
            <h2 className="text-center text-2xl font-bold text-ztf-navy sm:text-3xl">{t('programmes')}</h2>

            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold text-ztf-navyLight">{t('anglophone_programmes')}</h3>
              <div className="grid gap-6 sm:grid-cols-3">
                {anglophoneEntries.map(([key, programme], i) => (
                  <div
                    key={key}
                    className="glass-card animate-slide-up rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glass-gold"
                    style={{ animationDelay: `${i * 75}ms`, animationFillMode: 'backwards' }}
                  >
                    <Award className="mb-3 h-8 w-8 text-ztf-gold" />
                    <h4 className="font-bold text-ztf-navy">{programme.label}</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      {programme.departments.slice(0, 3).join(', ')}
                      {programme.departments.length > 3 ? '...' : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <h3 className="mb-4 text-lg font-semibold text-ztf-navyLight">{t('francophone_programmes')}</h3>
              <div className="grid gap-6 sm:grid-cols-3">
                {francophoneEntries.map(([key, programme], i) => (
                  <div
                    key={key}
                    className="glass-card animate-slide-up rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glass-gold"
                    style={{ animationDelay: `${i * 75}ms`, animationFillMode: 'backwards' }}
                  >
                    <Award className="mb-3 h-8 w-8 text-ztf-gold" />
                    <h4 className="font-bold text-ztf-navy">{programme.label}</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      {programme.departments.slice(0, 3).join(', ')}
                      {programme.departments.length > 3 ? '...' : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Higher Institutes */}
        <section className="bg-white py-16">
          <div className="container">
            <h2 className="text-center text-2xl font-bold text-ztf-navy sm:text-3xl">{t('schools_title')}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {HIGHER_INSTITUTES.map((institute) => (
                <a
                  key={institute.key}
                  href={`${CONTACT_INFO.mainSiteUrl}/${isFr ? 'fr' : 'en'}/schools`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-gray-100 p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <GraduationCap className="mb-3 h-7 w-7 text-ztf-gold" />
                  <span className="text-xs font-bold uppercase tracking-wide text-ztf-gold">
                    {isFr ? institute.abbreviationFr : institute.abbreviationEn}
                  </span>
                  <h4 className="mt-1 font-semibold text-ztf-navy">{isFr ? institute.nameFr : institute.nameEn}</h4>
                  <ul className="mt-3 space-y-1 text-sm text-gray-500">
                    {(isFr ? institute.schoolsFr : institute.schoolsEn).map((school) => (
                      <li key={school}>&bull; {school}</li>
                    ))}
                  </ul>
                </a>
              ))}

              <a
                href={`${CONTACT_INFO.mainSiteUrl}/${isFr ? 'fr' : 'en'}/schools`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-dashed border-gray-200 p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <GraduationCap className="mb-3 h-7 w-7 text-ztf-gold" />
                <span className="text-xs font-bold uppercase tracking-wide text-gray-400">{t('standalone_school')}</span>
                <h4 className="mt-1 font-semibold text-ztf-navy">
                  {isFr ? STANDALONE_SCHOOL.nameFr : STANDALONE_SCHOOL.nameEn} (
                  {isFr ? STANDALONE_SCHOOL.abbreviationFr : STANDALONE_SCHOOL.abbreviationEn})
                </h4>
              </a>
            </div>
          </div>
        </section>

        {/* Why ZTF */}
        <section className="bg-gray-50 py-16">
          <div className="container">
            <h2 className="text-center text-2xl font-bold text-ztf-navy sm:text-3xl">{t('why_title')}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(['why_1', 'why_2', 'why_3', 'why_4'] as const).map((key) => (
                <div key={key} className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                  <FileText className="mx-auto mb-3 h-8 w-8 text-ztf-gold" />
                  <h4 className="font-semibold text-ztf-navy">{t(`${key}_title`)}</h4>
                  <p className="mt-2 text-sm text-gray-500">{t(`${key}_text`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Admission requirements */}
        <section className="bg-white py-16">
          <div className="container max-w-3xl">
            <h2 className="text-center text-2xl font-bold text-ztf-navy sm:text-3xl">{t('requirements_title')}</h2>
            <Accordion type="single" collapsible className="mt-10">
              {REQUIREMENT_KEYS.map((key) => (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger className="text-ztf-navy">{t(key)}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">{t(`req_${key}`)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-ztf-navyDeep py-16 text-white">
          <div className="container">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">{tContact('title')}</h2>
            <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
                <Phone className="mx-auto mb-2 h-6 w-6 text-ztf-gold" />
                <p className="text-sm font-semibold">{tContact('phone')}</p>
                {CONTACT_INFO.phones.map((phone) => (
                  <p key={phone} className="mt-1 text-xs text-white/70">
                    {phone}
                  </p>
                ))}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
                <Mail className="mx-auto mb-2 h-6 w-6 text-ztf-gold" />
                <p className="text-sm font-semibold">{tContact('email')}</p>
                <p className="mt-1 text-xs text-white/70">{CONTACT_INFO.email}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
                <MapPin className="mx-auto mb-2 h-6 w-6 text-ztf-gold" />
                <p className="text-sm font-semibold">{tContact('address')}</p>
                <p className="mt-1 text-xs text-white/70">{tContact('address_value')}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
                <MessageCircle className="mx-auto mb-2 h-6 w-6 text-ztf-gold" />
                <p className="text-sm font-semibold">{tContact('hours')}</p>
                <p className="mt-1 text-xs text-white/70">{tContact('hours_value')}</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button asChild variant="secondary">
                <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  {tContact('whatsapp')}
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-ztf-navy py-16 text-center text-white">
          <div className="container">
            <h2 className="text-2xl font-bold sm:text-3xl">{t('start_registration')}</h2>
            <div className="mt-8">
              <Button asChild size="lg" variant="secondary">
                <Link href="/register/1">
                  {t('start_registration')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

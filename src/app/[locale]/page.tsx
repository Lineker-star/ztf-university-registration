import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import {
  Annoyed,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  School,
  Search,
  Sparkles,
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

const STEP_ICONS = [Users, GraduationCap, ClipboardCheck, UploadCloud, Users, CheckCircle2];
const SCHOOL_KEYS = ['school_1', 'school_2', 'school_3', 'school_4', 'school_5', 'school_6', 'school_7', 'school_8', 'school_9'] as const;
const SCHOOL_ICONS = [BookOpen, MessageCircle, School, Annoyed, Award, ClipboardCheck, Users, Sparkles, GraduationCap];
const REQUIREMENT_KEYS = ['hnd', 'btech', 'mtech', 'bts', 'licence', 'master'] as const;

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations('home');
  const tContact = useTranslations('contact');

  const anglophoneEntries = Object.entries(ANGLOPHONE_PROGRAMMES);
  const francophoneEntries = Object.entries(FRANCOPHONE_PROGRAMMES);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-ztf-navyDeep via-ztf-navy to-ztf-navyDeep text-white">
          <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-ztf-gold/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="container relative py-20 sm:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-ztf-gold/40 bg-ztf-gold/10 px-4 py-1.5 text-sm font-medium text-ztf-goldLight">
                <Sparkles className="h-4 w-4" />
                {t('subtitle')}
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{t('title')}</h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">{t('description')}</p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/register/1">
                    {t('start_registration')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/status">
                    <Search className="h-4 w-4" />
                    {t('check_status')}
                  </Link>
                </Button>
              </div>

              <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { value: '9', label: t('schools_title') },
                  { value: '6', label: t('programmes') },
                  { value: '2026', label: t('academic_year_label') },
                  { value: '2', label: t('languages_label') },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm"
                  >
                    <p className="text-2xl font-bold text-ztf-goldLight">{stat.value}</p>
                    <p className="mt-1 text-xs text-white/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
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
                {anglophoneEntries.map(([key, programme]) => (
                  <Card key={key} className="border-gray-100 transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <Award className="mb-3 h-8 w-8 text-ztf-gold" />
                      <h4 className="font-bold text-ztf-navy">{programme.label}</h4>
                      <p className="mt-2 text-sm text-gray-500">
                        {programme.departments.slice(0, 3).join(', ')}
                        {programme.departments.length > 3 ? '...' : ''}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <h3 className="mb-4 text-lg font-semibold text-ztf-navyLight">{t('francophone_programmes')}</h3>
              <div className="grid gap-6 sm:grid-cols-3">
                {francophoneEntries.map(([key, programme]) => (
                  <Card key={key} className="border-gray-100 transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <Award className="mb-3 h-8 w-8 text-ztf-gold" />
                      <h4 className="font-bold text-ztf-navy">{programme.label}</h4>
                      <p className="mt-2 text-sm text-gray-500">
                        {programme.departments.slice(0, 3).join(', ')}
                        {programme.departments.length > 3 ? '...' : ''}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Schools */}
        <section className="bg-white py-16">
          <div className="container">
            <h2 className="text-center text-2xl font-bold text-ztf-navy sm:text-3xl">{t('schools_title')}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SCHOOL_KEYS.map((key, index) => {
                const Icon = SCHOOL_ICONS[index];
                return (
                  <a
                    key={key}
                    href={`${CONTACT_INFO.mainSiteUrl}/en/schools`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-gray-100 p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <Icon className="mb-3 h-7 w-7 text-ztf-gold" />
                    <h4 className="font-semibold text-ztf-navy">{t(key)}</h4>
                    <p className="mt-2 text-sm text-gray-500">{t(`${key}_desc`)}</p>
                  </a>
                );
              })}
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

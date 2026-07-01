import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileCheck,
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
import { HIGHER_INSTITUTES, MAIN_PROGRAMMES, TOTAL_FIELDS } from '@/lib/constants/programmes';
import { CONTACT_INFO } from '@/lib/constants/contact';

const STEP_ICONS = [Users, GraduationCap, ClipboardCheck, UploadCloud, Users, CheckCircle2];

const ADMISSION_REQUIREMENTS = [
  {
    en: 'An academic registration form (obtained from the school)',
    fr: "Une fiche d'inscription académique (à retirer à la scolarité)",
  },
  {
    en: 'A certified true copy of the Baccalaureate, GCE A Level, or any other equivalent',
    fr: 'Deux (02) photocopies certifiées conformes du diplôme le plus élevé ou du relevé de notes',
  },
  {
    en: 'Two (02) certified photocopies of the birth certificate less than three months old',
    fr: "Deux (02) photocopies certifiées conformes de l'acte de naissance datant de moins de trois mois",
  },
  {
    en: 'Four (04) 4x4 photos bearing the surname, first name, course, nationality, region of origin, date and place of birth on the back',
    fr: 'Quatre (04) photos 4x4 portant le nom et prénom, parcours, nationalité, région d\'origine, date et lieu de naissance, au verso',
  },
  {
    en: 'A receipt attesting to payment of the pre-registration fee of 35,000 FCFA to the Institute\'s registration department',
    fr: "Un quitus attestant le paiement des frais de pré-inscription d'un montant de 35 000 FCFA au service des inscriptions de l'Institut",
  },
  {
    en: 'A photocopy of the national identity card or equivalent document',
    fr: "Une photocopie de la carte nationale d'identité ou d'un document équivalent",
  },
  {
    en: 'The receipt for the medical examination issued by a Hope Clinic doctor (to be deposited with the School after the medical examination)',
    fr: 'Le quitus de la visite médicale délivré par un médecin de la Hope Clinic (à déposer à la Scolarité après la visite médicale)',
  },
  {
    en: "An A4 envelope and a cardboard folder, both bearing the candidate's address",
    fr: "Une enveloppe A4 et une chemise cartonnée, les deux portant l'adresse du candidat",
  },
];

const FOREIGN_DIPLOMA_DOCS = [
  {
    en: 'A certified copy (typed) of the birth certificate',
    fr: "Une copie (dactylographiée) certifiée conforme d'acte de naissance",
  },
  {
    en: 'A certified photocopy of the diploma authenticated by competent authorities',
    fr: 'Une photocopie certifiée conforme du diplôme authentifié par les autorités compétentes',
  },
  {
    en: "An A4 envelope bearing the candidate's name and address",
    fr: "Une enveloppe au format A4 portant le nom et l'adresse du candidat",
  },
];

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const isFr = locale === 'fr';
  const t = useTranslations('home');
  const tContact = useTranslations('contact');

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

        {/* Higher Institutes */}
        <section className="bg-gray-50 py-16">
          <div className="container">
            <h2 className="text-center text-2xl font-bold text-ztf-navy sm:text-3xl">{t('schools_title')}</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {HIGHER_INSTITUTES.map((institute, i) => (
                <div
                  key={institute.id}
                  className="glass-card animate-slide-up rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glass-gold"
                  style={{ animationDelay: `${i * 75}ms`, animationFillMode: 'backwards' }}
                >
                  <GraduationCap className="mb-3 h-7 w-7 text-ztf-gold" />
                  <span className="text-xs font-bold uppercase tracking-wide text-ztf-gold">
                    {isFr ? institute.acronymFr : institute.acronymEn}
                  </span>
                  <h4 className="mt-1 font-semibold leading-snug text-ztf-navy">
                    {isFr ? institute.nameFr : institute.nameEn}
                  </h4>
                  <ul className="mt-3 space-y-1 text-sm text-gray-500">
                    {institute.fields.map((field) => (
                      <li key={field.id}>
                        <span className="font-medium text-gray-400">{field.numberLabel}</span>{' '}
                        {isFr ? field.fr : field.en}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="mb-3 text-sm font-medium text-gray-500">{t('programmes')}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {MAIN_PROGRAMMES.map((p) => (
                  <span
                    key={p.id}
                    className="rounded-full border border-ztf-gold/30 bg-ztf-gold/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ztf-navy"
                  >
                    {p.id.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why ZTF */}
        <section className="bg-white py-16">
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

        {/* Official Admission Requirements */}
        <section className="bg-gradient-to-br from-ztf-navyDeep to-ztf-navy py-16 text-white sm:py-20">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="mb-10 text-center">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-ztf-gold/40 bg-ztf-gold/20 px-4 py-1.5 text-sm font-medium text-ztf-goldLight">
                <FileCheck className="h-4 w-4" />
                {isFr ? 'Documents Requis' : 'Required Documents'}
              </span>
              <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
                {t('admission_req_title')}
              </h2>
              <p className="text-lg text-white/70">{t('admission_req_subtitle')}</p>
            </div>

            {/* Main checklist */}
            <div className="glass-card-dark mb-6 rounded-2xl p-6 sm:p-8">
              <ul className="space-y-3">
                {ADMISSION_REQUIREMENTS.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ztf-gold/40 bg-ztf-gold/20">
                      <Check className="h-3.5 w-3.5 text-ztf-gold" />
                    </div>
                    <span className="text-sm leading-relaxed text-white/85 sm:text-base">
                      {isFr ? req.fr : req.en}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fee banner */}
            <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-ztf-gold p-5 sm:flex-row sm:p-6">
              <div>
                <p className="text-lg font-bold text-ztf-navyDeep sm:text-xl">
                  {t('admission_req_fees')}
                </p>
                <p className="mt-1 text-sm text-ztf-navyDeep/70">{t('admission_req_covers_title')}</p>
                <p className="mt-1 text-sm font-medium text-ztf-navyDeep/80">
                  {t('admission_req_covers')}
                </p>
              </div>
              <div className="whitespace-nowrap text-3xl font-extrabold text-ztf-navyDeep sm:text-4xl">
                {t('admission_req_fees_amount')}
              </div>
            </div>

            {/* Foreign diplomas notice */}
            <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 sm:p-6">
              <div className="mb-3 flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <div>
                  <p className="font-semibold text-amber-300">{t('admission_req_foreign_title')}</p>
                  <p className="mt-1 text-sm text-white/70">{t('admission_req_foreign_text')}</p>
                </div>
              </div>
              <ul className="ml-8 space-y-2">
                {FOREIGN_DIPLOMA_DOCS.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/75">
                    <span className="mt-1 text-amber-400">—</span>
                    {isFr ? doc.fr : doc.en}
                  </li>
                ))}
              </ul>
            </div>

            {/* Location line */}
            <div className="text-center text-sm text-white/60">
              <MapPin className="mr-1.5 inline h-4 w-4 text-ztf-gold" />
              {isFr
                ? 'Koumé - Bertoua, En Face la Hope Clinic · Tél: 691 459 611 | 690 355 329 | 657 546 543'
                : 'Koumé - Bertoua, Opposite Hope Clinic · Tel: 691 459 611 | 690 355 329 | 657 546 543'}
            </div>
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

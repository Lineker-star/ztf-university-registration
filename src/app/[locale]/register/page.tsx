import { redirect } from '@/navigation';

export default function RegisterEntryPage({ params: { locale } }: { params: { locale: string } }) {
  redirect({ href: '/register/1', locale });
}

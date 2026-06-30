import { redirect } from '@/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect({ href: '/admin/login', locale });
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50 lg:flex-row">
      <div className="pointer-events-none fixed inset-0 bg-mesh-gradient opacity-[0.04]" />
      <AdminSidebar />
      <div className="relative z-10 flex-1 overflow-x-hidden">
        <div className="container max-w-7xl py-6 sm:py-8">{children}</div>
      </div>
    </div>
  );
}

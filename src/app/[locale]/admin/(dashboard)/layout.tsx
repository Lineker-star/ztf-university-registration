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
    <div className="flex min-h-screen flex-col bg-gray-50 lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        <div className="container max-w-7xl py-6 sm:py-8">{children}</div>
      </div>
    </div>
  );
}

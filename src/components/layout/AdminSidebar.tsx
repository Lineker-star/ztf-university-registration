'use client';

import { useTranslations } from 'next-intl';
import { LayoutDashboard, FileText, FolderOpen, BarChart3, LogOut, GraduationCap } from 'lucide-react';

import { Link, usePathname, useRouter } from '@/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const t = useTranslations('admin');
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/admin/applications', label: t('applications'), icon: FileText },
    { href: '/admin/documents', label: t('documents'), icon: FolderOpen },
    { href: '/admin/reports', label: t('reports'), icon: BarChart3 },
  ];

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-100 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-6 font-bold text-ztf-navy">
        <GraduationCap className="h-6 w-6 text-ztf-gold" />
        ZTF Admin
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active ? 'bg-ztf-navy text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-ztf-navy'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
}

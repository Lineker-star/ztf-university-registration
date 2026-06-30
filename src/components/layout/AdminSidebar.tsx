'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { LayoutDashboard, FileText, FolderOpen, BarChart3, LogOut, Menu, X } from 'lucide-react';

import { Link, usePathname, useRouter } from '@/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const t = useTranslations('admin');
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
    <>
      <div className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2 font-bold text-ztf-navy">
          <Image src="/images/logo.png" alt="ZTF" width={32} height={32} className="rounded-full" />
          ZTF Admin
        </div>
        <button
          type="button"
          className="p-2 text-ztf-navy"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-screen w-64 transform flex-col border-r border-gray-100 bg-white transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="hidden h-16 items-center gap-2 border-b border-gray-100 px-6 font-bold text-ztf-navy lg:flex">
          <Image src="/images/logo.png" alt="ZTF" width={32} height={32} className="rounded-full" />
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
    </>
  );
}

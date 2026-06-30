import { NextResponse } from 'next/server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { getAdminUser } from '@/lib/auth';
import { DashboardStats } from '@/types';

export async function GET() {
  try {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from('applications')
      .select('status, programme, higher_institute, created_at')
      .eq('is_draft', false);

    if (error) throw error;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: DashboardStats = {
      total: data.length,
      pending: 0,
      under_review: 0,
      shortlisted: 0,
      admitted: 0,
      rejected: 0,
      deferred: 0,
      by_programme: {},
      by_institute: {},
      this_month: 0,
    };

    for (const row of data) {
      if (row.status in stats) {
        (stats as any)[row.status] += 1;
      }
      if (row.programme) {
        stats.by_programme[row.programme] = (stats.by_programme[row.programme] ?? 0) + 1;
      }
      if (row.higher_institute) {
        stats.by_institute[row.higher_institute] = (stats.by_institute[row.higher_institute] ?? 0) + 1;
      }
      if (new Date(row.created_at) >= monthStart) {
        stats.this_month += 1;
      }
    }

    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { getAdminUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const programme = searchParams.get('programme');
    const institute = searchParams.get('institute');
    const field = searchParams.get('field');
    const search = searchParams.get('search')?.trim();
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const from = (page - 1) * limit;

    const personalInfoSelector = search ? 'personal_info!inner' : 'personal_info';

    let query = supabase
      .from('applications')
      .select(
        `
        id, application_number, status, programme, higher_institute, field_of_study,
        submitted_at, created_at, language,
        ${personalInfoSelector}(first_name, last_name, email, phone)
      `,
        { count: 'exact' }
      )
      .eq('is_draft', false)
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (status && status !== 'all') query = query.eq('status', status);
    if (programme && programme !== 'all') query = query.eq('programme', programme);
    if (institute && institute !== 'all') query = query.eq('higher_institute', institute);
    if (field && field !== 'all') query = query.eq('field_of_study', field);
    if (dateFrom) query = query.gte('created_at', dateFrom);
    if (dateTo) query = query.lte('created_at', `${dateTo}T23:59:59`);
    if (search) {
      const escaped = search.replace(/[%,]/g, '');
      query = query.or(
        `application_number.ilike.%${escaped}%,personal_info.first_name.ilike.%${escaped}%,personal_info.last_name.ilike.%${escaped}%,personal_info.email.ilike.%${escaped}%`
      );
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, applications: data ?? [], total: count ?? 0, page, limit });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const appNumber = searchParams.get('number')?.trim();
    const email = searchParams.get('email')?.trim();
    const supabase = createAdminSupabaseClient();

    if (!appNumber && !email) {
      return NextResponse.json({ error: 'Provide application number or email' }, { status: 400 });
    }

    let query = supabase
      .from('applications')
      .select(
        `
        id, application_number, status, programme, academic_system,
        submitted_at, created_at, department, specialization,
        personal_info!inner(first_name, last_name, email)
      `
      )
      .eq('is_draft', false);

    if (appNumber) {
      query = query.eq('application_number', appNumber);
    } else if (email) {
      query = query.eq('personal_info.email', email);
    }

    const { data, error } = await query.maybeSingle();
    if (error || !data) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

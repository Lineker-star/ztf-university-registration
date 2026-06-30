import { NextRequest, NextResponse } from 'next/server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';

// Returns full application detail for the PDF download on the public Status
// Check page. Unlike /api/status (looked up by number OR email alone),
// this requires BOTH to be supplied and match the same record -- the
// application number alone is a low-entropy, effectively sequential
// identifier, so a single-field lookup is not a safe gate for returning
// full personal/academic/guardian PII.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const appNumber = searchParams.get('number')?.trim();
    const email = searchParams.get('email')?.trim();
    const supabase = createAdminSupabaseClient();

    if (!appNumber || !email) {
      return NextResponse.json({ error: 'Application number and email are both required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('applications')
      .select(
        `
        id, application_number, status, submitted_at, created_at,
        higher_institute, field_of_study, specialty, programme, study_mode, intake_session,
        personal_info!inner(first_name, last_name, date_of_birth, gender, nationality, email, phone, address, city, region),
        academic_qualifications(qualification_type, institution_name, graduation_year, gpa_grade, subjects, bacc_series),
        guardian_info(guardian_full_name, guardian_relationship, guardian_phone, emergency_full_name, emergency_phone)
      `
      )
      .eq('is_draft', false)
      .eq('application_number', appNumber)
      .eq('personal_info.email', email)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

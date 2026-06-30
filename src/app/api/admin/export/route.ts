import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { getAdminUser } from '@/lib/auth';
import { getInstitute, getField, getSpecialtiesByField, MAIN_PROGRAMMES } from '@/lib/constants/programmes';

export async function GET(req: NextRequest) {
  try {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const programme = searchParams.get('programme');

    let query = supabase
      .from('applications')
      .select(
        `
        application_number, status, programme, higher_institute, field_of_study,
        sub_department, specialty, study_mode, intake_session, academic_year,
        submitted_at, language,
        personal_info(first_name, last_name, email, phone, nationality, city, region),
        guardian_info(guardian_full_name, guardian_phone, guardian_relationship)
      `
      )
      .eq('is_draft', false)
      .order('submitted_at', { ascending: false });

    if (status && status !== 'all') query = query.eq('status', status);
    if (programme && programme !== 'all') query = query.eq('programme', programme);

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data ?? []).map((app: any) => {
      const institute = app.higher_institute ? getInstitute(app.higher_institute) : undefined;
      const field = app.higher_institute && app.field_of_study ? getField(app.higher_institute, app.field_of_study) : undefined;
      const specialty = getSpecialtiesByField(field).find((s) => s.id === app.specialty);
      const programme = MAIN_PROGRAMMES.find((p) => p.id === app.programme);

      return {
        'Application No.': app.application_number,
        'First Name': app.personal_info?.first_name,
        'Last Name': app.personal_info?.last_name,
        Email: app.personal_info?.email,
        Phone: app.personal_info?.phone,
        Nationality: app.personal_info?.nationality,
        City: app.personal_info?.city,
        Region: app.personal_info?.region,
        Institute: institute ? `${institute.acronymEn} — ${institute.nameEn}` : app.higher_institute,
        Field: field?.en ?? app.field_of_study,
        'Sub-Department': app.sub_department ?? '',
        Specialty: specialty?.en ?? app.specialty,
        Programme: programme?.en ?? app.programme,
        Mode: app.study_mode,
        Intake: app.intake_session,
        'Academic Year': app.academic_year,
        Language: app.language?.toUpperCase(),
        Status: app.status,
        Submitted: app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '-',
        Guardian: app.guardian_info?.guardian_full_name,
        'Guardian Phone': app.guardian_info?.guardian_phone,
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applications');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="ZTF_Applications_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

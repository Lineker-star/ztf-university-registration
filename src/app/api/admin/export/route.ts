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
        personal_info(first_name, last_name, email, phone, nationality, city, region, date_of_birth, gender),
        academic_qualifications(qualification_type, institution_name, graduation_year, gpa_grade, subjects, bacc_series),
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
      const specialty = getSpecialtiesByField(field).find((s: any) => s.id === app.specialty);
      const programme = MAIN_PROGRAMMES.find((p) => p.id === app.programme);

      const quals: any[] = app.academic_qualifications ?? [];
      const aLevel = quals.find((q: any) => q.qualification_type === 'a_level');
      const bacc = quals.find((q: any) => q.qualification_type === 'bacc');
      const otherQuals = quals
        .filter((q: any) => q.qualification_type !== 'a_level' && q.qualification_type !== 'bacc')
        .map((q: any) => `${q.qualification_type?.toUpperCase()} — ${q.institution_name} (${q.graduation_year})`)
        .join('; ');

      const gceSubjects = aLevel?.subjects?.length
        ? (aLevel.subjects as any[]).map((s: any) => `${s.name}: ${s.grade}`).join(', ')
        : '';

      return {
        'Application No.': app.application_number,
        'First Name': app.personal_info?.first_name,
        'Last Name': app.personal_info?.last_name,
        'Date of Birth': app.personal_info?.date_of_birth,
        Gender: app.personal_info?.gender,
        Email: app.personal_info?.email,
        Phone: app.personal_info?.phone,
        Nationality: app.personal_info?.nationality,
        City: app.personal_info?.city,
        Region: app.personal_info?.region,
        // GCE A-Level
        'GCE A-Level School': aLevel?.institution_name ?? '',
        'GCE A-Level Year': aLevel?.graduation_year ?? '',
        'GCE A-Level Subjects': gceSubjects,
        // Baccalauréat
        'Bacc School': bacc?.institution_name ?? '',
        'Bacc Year': bacc?.graduation_year ?? '',
        'Bacc Series': bacc?.bacc_series ?? '',
        'Bacc Average': bacc?.gpa_grade ?? '',
        // Other qualifications
        'Other Qualifications': otherQuals,
        // Programme
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
        // Guardian
        Guardian: app.guardian_info?.guardian_full_name,
        'Guardian Relationship': app.guardian_info?.guardian_relationship,
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

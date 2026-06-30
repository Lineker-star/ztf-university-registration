import { NextRequest, NextResponse } from 'next/server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { sendConfirmationEmail } from '@/lib/utils/email';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const submissionLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  submissionLog.set(ip, timestamps);
  return timestamps.length >= RATE_LIMIT_MAX;
}

function recordSubmission(ip: string) {
  const timestamps = submissionLog.get(ip) ?? [];
  timestamps.push(Date.now());
  submissionLog.set(ip, timestamps);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions from this address. Please try again tomorrow.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { applicationId, formData } = body;
    if (!applicationId || !formData) {
      return NextResponse.json({ error: 'Missing applicationId or formData' }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();

    const { data: existing, error: existingError } = await supabase
      .from('applications')
      .select('id, is_draft')
      .eq('id', applicationId)
      .single();
    if (existingError || !existing) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    if (!existing.is_draft) {
      return NextResponse.json({ error: 'Application has already been submitted' }, { status: 409 });
    }

    // 1. Save personal info
    if (formData.step1) {
      const { error: personalError } = await supabase
        .from('personal_info')
        .upsert({ application_id: applicationId, ...formData.step1 }, { onConflict: 'application_id' });
      if (personalError) throw personalError;
    }

    // 2. Save academic qualifications
    if (formData.step2?.qualifications?.length) {
      await supabase.from('academic_qualifications').delete().eq('application_id', applicationId);
      const quals = formData.step2.qualifications.map((q: any) => ({ ...q, application_id: applicationId }));
      const { error: qualError } = await supabase.from('academic_qualifications').insert(quals);
      if (qualError) throw qualError;
    }

    // 3. Save professional experience
    if (formData.step2?.experience) {
      const { error: expError } = await supabase
        .from('professional_experience')
        .upsert(
          { application_id: applicationId, ...formData.step2.experience },
          { onConflict: 'application_id' }
        );
      if (expError) throw expError;
    }

    // 4. Save guardian info
    if (formData.step5) {
      const { error: guardError } = await supabase
        .from('guardian_info')
        .upsert({ application_id: applicationId, ...formData.step5 }, { onConflict: 'application_id' });
      if (guardError) throw guardError;
    }

    // 5. Update application with programme choice + mark submitted
    const { data: app, error: appError } = await supabase
      .from('applications')
      .update({
        ...formData.step3,
        is_draft: false,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        language: formData.language === 'fr' ? 'fr' : 'en',
      })
      .eq('id', applicationId)
      .select()
      .single();
    if (appError) throw appError;

    // 6. Log status change
    await supabase.from('application_history').insert({
      application_id: applicationId,
      status_from: null,
      status_to: 'pending',
      notes: 'Application submitted by student',
    });

    // 7. Send confirmation email
    if (formData.step1?.email) {
      await sendConfirmationEmail({
        to: formData.step1.email,
        firstName: formData.step1.first_name,
        applicationNumber: app.application_number,
        programme: app.programme,
        language: formData.language === 'fr' ? 'fr' : 'en',
      });
    }

    recordSubmission(ip);

    return NextResponse.json({ success: true, applicationNumber: app.application_number });
  } catch (error: any) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

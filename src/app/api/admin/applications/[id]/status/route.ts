import { NextRequest, NextResponse } from 'next/server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { getAdminUser } from '@/lib/auth';
import { sendStatusUpdateEmail } from '@/lib/utils/email';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createAdminSupabaseClient();
    const { status, notes, rejection_reason } = await req.json();

    const { data: current, error: currentError } = await supabase
      .from('applications')
      .select('status, language, application_number, personal_info(first_name, email)')
      .eq('id', params.id)
      .single();
    if (currentError || !current) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const { data: app, error } = await supabase
      .from('applications')
      .update({
        status,
        admin_notes: notes,
        rejection_reason: rejection_reason ?? null,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();
    if (error) throw error;

    await supabase.from('application_history').insert({
      application_id: params.id,
      status_from: current.status,
      status_to: status,
      changed_by: user.id,
      changed_by_email: user.email,
      notes,
    });

    const personalInfo = (current as any).personal_info;
    if (personalInfo?.email && status !== current.status) {
      await sendStatusUpdateEmail({
        to: personalInfo.email,
        firstName: personalInfo.first_name,
        applicationNumber: current.application_number,
        newStatus: status,
        language: current.language,
        notes,
      });
    }

    return NextResponse.json({ success: true, application: app });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

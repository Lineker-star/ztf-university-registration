import { NextRequest, NextResponse } from 'next/server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { sessionToken, applicationId, stepData, currentStep } = await req.json();

    if (!sessionToken || !applicationId) {
      return NextResponse.json({ error: 'Missing sessionToken or applicationId' }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();

    const { error } = await supabase
      .from('registration_drafts')
      .update({
        step_data: stepData,
        current_step: currentStep,
        last_saved: new Date().toISOString(),
      })
      .eq('session_token', sessionToken)
      .eq('application_id', applicationId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

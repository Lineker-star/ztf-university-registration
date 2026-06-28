import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { language } = await req.json().catch(() => ({ language: 'en' }));
    const supabase = createAdminSupabaseClient();
    const sessionToken = uuidv4();

    const { data: app, error } = await supabase
      .from('applications')
      .insert({ is_draft: true, language: language === 'fr' ? 'fr' : 'en' })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('registration_drafts').insert({
      session_token: sessionToken,
      application_id: app.id,
      step_data: {},
      current_step: 1,
    });

    return NextResponse.json({
      success: true,
      applicationId: app.id,
      applicationNumber: app.application_number,
      sessionToken,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

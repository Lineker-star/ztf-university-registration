import { NextResponse } from 'next/server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { getAdminUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from('documents')
      .select(
        `id, document_type, document_name, file_url, file_size, mime_type, is_required, is_verified, created_at,
         applications!inner(application_number, is_draft, personal_info(first_name, last_name))`
      )
      .eq('applications.is_draft', false)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;

    return NextResponse.json({ success: true, documents: data ?? [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

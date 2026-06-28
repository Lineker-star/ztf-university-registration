import { NextRequest, NextResponse } from 'next/server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { getAdminUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.storage.from('student-documents').createSignedUrl(path, 300);

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? 'Could not sign URL' }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: data.signedUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { DOCUMENT_REQUIREMENTS } from '@/lib/constants/documents';

const MAGIC_BYTES: { mime: string; check: (bytes: Uint8Array) => boolean }[] = [
  { mime: 'application/pdf', check: (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 },
  { mime: 'image/jpeg', check: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    mime: 'image/png',
    check: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    check: (b) => b[0] === 0x50 && b[1] === 0x4b, // zip-based (xlsx)
  },
];

function isMagicByteValid(bytes: Uint8Array, mimeType: string): boolean {
  const rule = MAGIC_BYTES.find((m) => m.mime === mimeType);
  if (!rule) return true; // no rule defined, skip deep check
  return rule.check(bytes);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const applicationId = formData.get('applicationId') as string | null;
    const documentType = formData.get('documentType') as string | null;
    const target = (formData.get('target') as string | null) ?? 'document';

    if (!file || !applicationId || !documentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isPhoto = target === 'photo';
    const requirement = DOCUMENT_REQUIREMENTS.find((d) => d.type === documentType);
    const maxSizeMB = isPhoto ? 2 : requirement?.maxSizeMB ?? 10;
    const acceptedTypes = isPhoto
      ? ['image/jpeg', 'image/png']
      : requirement?.acceptedTypes ?? ['application/pdf', 'image/jpeg', 'image/png'];

    if (file.size > maxSizeMB * 1024 * 1024) {
      return NextResponse.json({ error: `File too large. Maximum ${maxSizeMB}MB.` }, { status: 400 });
    }

    if (!acceptedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not accepted.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    if (!isMagicByteValid(bytes, file.type)) {
      return NextResponse.json({ error: 'File content does not match its declared type.' }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const fileExt = file.name.split('.').pop();
    const bucket = isPhoto ? 'passport-photos' : 'student-documents';
    const fileName = `${applicationId}/${documentType}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, bytes, { contentType: file.type });

    if (uploadError) throw uploadError;

    if (isPhoto) {
      // passport-photos is a public bucket; a permanent public URL is fine here.
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return NextResponse.json({ success: true, url: publicUrl });
    }

    // student-documents is a private bucket: store the object path, not a
    // public URL (which would 404/403 since the bucket isn't public).
    // Admins resolve it to a short-lived signed URL on demand.
    const { data: doc, error: dbError } = await supabase
      .from('documents')
      .insert({
        application_id: applicationId,
        document_type: documentType,
        document_name: file.name,
        file_url: fileName,
        file_size: file.size,
        mime_type: file.type,
        is_required: requirement?.required ?? false,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

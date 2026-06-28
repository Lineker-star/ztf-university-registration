import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface ConfirmationEmailParams {
  to: string;
  firstName: string;
  applicationNumber: string;
  programme: string | null;
  language: 'en' | 'fr';
}

export async function sendConfirmationEmail({
  to,
  firstName,
  applicationNumber,
  programme,
  language,
}: ConfirmationEmailParams) {
  const isEn = language === 'en';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://register.ztfuniversity.com';

  const subject = isEn
    ? `Application Confirmed - ZTF University Institute [${applicationNumber}]`
    : `Candidature Confirmée - Institut Universitaire ZTF [${applicationNumber}]`;

  const html = isEn
    ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #003B7A; padding: 30px; text-align: center;">
        <h1 style="color: #C9A84C; margin: 0; font-size: 22px;">ZTF University Institute</h1>
      </div>
      <div style="padding: 30px; background: #fff;">
        <h2 style="color: #003B7A;">Dear ${firstName},</h2>
        <p>Thank you for applying to <strong>ZTF University Institute</strong>. Your application has been received successfully.</p>
        <div style="background: #f0f7ff; border-left: 4px solid #003B7A; padding: 20px; margin: 20px 0;">
          <p><strong>Application Number:</strong> ${applicationNumber}</p>
          <p><strong>Programme:</strong> ${programme ?? '-'}</p>
          <p><strong>Status:</strong> Pending Review</p>
        </div>
        <p>Our admissions team will review your application within <strong>5-7 business days</strong>.</p>
        <p>You can check your application status at: <a href="${appUrl}/en/status">${appUrl}/en/status</a></p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 14px;">ZTF University Institute | Bertoua, Cameroon<br/>Email: admissions@ztfuniversity.com</p>
      </div>
    </div>
  `
    : `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #003B7A; padding: 30px; text-align: center;">
        <h1 style="color: #C9A84C; margin: 0; font-size: 22px;">Institut Universitaire ZTF</h1>
      </div>
      <div style="padding: 30px; background: #fff;">
        <h2 style="color: #003B7A;">Cher(e) ${firstName},</h2>
        <p>Nous vous remercions d'avoir soumis votre candidature à l'<strong>Institut Universitaire ZTF</strong>. Votre dossier a bien été reçu.</p>
        <div style="background: #f0f7ff; border-left: 4px solid #003B7A; padding: 20px; margin: 20px 0;">
          <p><strong>Numéro de candidature :</strong> ${applicationNumber}</p>
          <p><strong>Filière :</strong> ${programme ?? '-'}</p>
          <p><strong>Statut :</strong> En attente d'examen</p>
        </div>
        <p>Notre équipe des admissions examinera votre dossier dans un délai de <strong>5 à 7 jours ouvrables</strong>.</p>
        <p>Vous pouvez vérifier le statut de votre candidature ici : <a href="${appUrl}/fr/status">${appUrl}/fr/status</a></p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 14px;">Institut Universitaire ZTF | Bertoua, Cameroun<br/>Email : admissions@ztfuniversity.com</p>
      </div>
    </div>
  `;

  try {
    await getResend().emails.send({
      from: `ZTF University Admissions <${process.env.RESEND_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('Confirmation email failed:', err);
  }
}

interface StatusUpdateEmailParams {
  to: string;
  firstName: string;
  applicationNumber: string;
  newStatus: string;
  language: 'en' | 'fr';
  notes?: string;
}

export async function sendStatusUpdateEmail({
  to,
  firstName,
  applicationNumber,
  newStatus,
  language,
  notes,
}: StatusUpdateEmailParams) {
  const isEn = language === 'en';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://register.ztfuniversity.com';

  const statusLabels: Record<string, { en: string; fr: string }> = {
    pending: { en: 'Pending Review', fr: "En attente d'examen" },
    under_review: { en: 'Under Review', fr: "En cours d'examen" },
    shortlisted: { en: 'Shortlisted', fr: 'Présélectionné(e)' },
    admitted: { en: 'ADMITTED', fr: 'ADMIS(E)' },
    rejected: { en: 'Not Successful', fr: 'Non retenu(e)' },
    deferred: { en: 'Deferred', fr: 'Reporté(e)' },
    withdrawn: { en: 'Withdrawn', fr: 'Retiré(e)' },
  };

  const statusLabel = statusLabels[newStatus]?.[language] ?? newStatus;

  const subject = isEn
    ? `Application Status Update - ${applicationNumber}`
    : `Mise à jour du statut - ${applicationNumber}`;

  const html = isEn
    ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
      <h2 style="color:#003B7A;">Dear ${firstName},</h2>
      <p>Your application status for <strong>${applicationNumber}</strong> has been updated:</p>
      <div style="background: #f0f7ff; border-left: 4px solid #003B7A; padding: 20px; margin: 20px 0;">
        <h3 style="color: #003B7A; margin: 0;">Status: ${statusLabel}</h3>
        ${notes ? `<p>${notes}</p>` : ''}
      </div>
      <p>Visit <a href="${appUrl}/en/status">our portal</a> for more details.</p>
    </div>
  `
    : `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
      <h2 style="color:#003B7A;">Cher(e) ${firstName},</h2>
      <p>Le statut de votre candidature <strong>${applicationNumber}</strong> a été mis à jour :</p>
      <div style="background: #f0f7ff; border-left: 4px solid #003B7A; padding: 20px; margin: 20px 0;">
        <h3 style="color: #003B7A; margin: 0;">Statut : ${statusLabel}</h3>
        ${notes ? `<p>${notes}</p>` : ''}
      </div>
      <p>Visitez <a href="${appUrl}/fr/status">notre portail</a> pour plus de détails.</p>
    </div>
  `;

  try {
    await getResend().emails.send({
      from: `ZTF University Admissions <${process.env.RESEND_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('Status update email failed:', err);
  }
}

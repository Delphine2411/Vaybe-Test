import nodemailer from "nodemailer";
import type { ApplicationRecord, EmailSendResult } from "@/lib/types";

const resendEndpoint = "https://api.resend.com/emails";

function buildValidationEmail(application: ApplicationRecord) {
  return {
    subject: "Votre candidature a ete validee",
    text: `Bonjour ${application.name},

Nous sommes ravis de vous informer que votre candidature pour le role ${application.role} a ete retenue pour la suite du processus.

Notre equipe reviendra tres vite vers vous avec les prochaines etapes.

Cordialement,
L'equipe Vaybe`,
  };
}

function buildRejectionEmail(application: ApplicationRecord) {
  return {
    subject: "Retour sur votre candidature",
    text: `Bonjour ${application.name},

Merci pour votre candidature pour le role ${application.role}.

Apres etude de votre profil, nous ne poursuivrons pas le process pour le moment.

Raison partagee par l'equipe:
${application.rejectionReason || "Votre candidature n'a pas ete retenue pour cette etape."}

Nous vous remercions pour l'interet porte a Vaybe et vous souhaitons une belle suite.

Cordialement,
L'equipe Vaybe`,
  };
}

function buildMessage(application: ApplicationRecord) {
  return application.status === "validated"
    ? buildValidationEmail(application)
    : buildRejectionEmail(application);
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT || "587");
  const secure =
    process.env.SMTP_SECURE === "true" || port === 465;
  const from =
    process.env.SMTP_FROM_EMAIL || "Vaybe <no-reply@vaybe.test>";

  return {
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    from,
  };
}

async function sendViaNodemailer(
  application: ApplicationRecord
): Promise<EmailSendResult> {
  const smtpConfig = getSmtpConfig();

  if (!smtpConfig) {
    return {
      sent: false,
      provider: "console",
    };
  }

  try {
    const transport = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: smtpConfig.auth,
    });

    const message = buildMessage(application);

    await transport.sendMail({
      from: smtpConfig.from,
      to: application.email,
      subject: message.subject,
      text: message.text,
    });

    return {
      sent: true,
      provider: "nodemailer",
    };
  } catch (error) {
    return {
      sent: false,
      provider: "nodemailer",
      error:
        error instanceof Error ? error.message : "Erreur inconnue pendant l'envoi SMTP.",
    };
  }
}

async function sendViaResend(
  application: ApplicationRecord
): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Vaybe <onboarding@resend.dev>";

  if (!apiKey) {
    return {
      sent: false,
      provider: "console",
    };
  }

  const message = buildMessage(application);

  try {
    const response = await fetch(resendEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [application.email],
        subject: message.subject,
        text: message.text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      return {
        sent: false,
        provider: "resend",
        error: errorText || "Echec d'envoi via Resend.",
      };
    }

    return {
      sent: true,
      provider: "resend",
    };
  } catch (error) {
    return {
      sent: false,
      provider: "resend",
      error:
        error instanceof Error ? error.message : "Erreur inconnue pendant l'envoi.",
    };
  }
}

export async function sendApplicationStatusEmail(
  application: ApplicationRecord
): Promise<EmailSendResult> {
  const smtpConfig = getSmtpConfig();

  if (smtpConfig) {
    const result = await sendViaNodemailer(application);

    if (result.sent || result.provider === "nodemailer") {
      return result;
    }
  }

  const resendResult = await sendViaResend(application);

  if (resendResult.sent || resendResult.provider === "resend") {
    return resendResult;
  }

  console.info(
    `[email:console] ${application.status} -> ${application.email} (${application.name})`
  );

  return {
    sent: false,
    provider: "console",
  };
}

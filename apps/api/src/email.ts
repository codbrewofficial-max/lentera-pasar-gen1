import nodemailer from "nodemailer";
import { apiConfig } from "./env.js";

// Transport dibuat sekali di startup. Kalau SMTP_HOST tidak di-set (mis. dev lokal
// tanpa SMTP), kita tidak bikin transporter sama sekali dan fallback ke console log
// supaya development tetap bisa jalan tanpa perlu setup SMTP asli.
const transporter = apiConfig.smtp.host
  ? nodemailer.createTransport({
      host: apiConfig.smtp.host,
      port: apiConfig.smtp.port,
      secure: apiConfig.smtp.secure,
      auth: apiConfig.smtp.user ? { user: apiConfig.smtp.user, pass: apiConfig.smtp.password } : undefined
    })
  : null;

export type SendEmailInput = { to: string; subject: string; html: string };

export const sendEmail = async (input: SendEmailInput) => {
  if (!transporter) {
    // eslint-disable-next-line no-console
    console.log(
      `[email:dev-fallback] SMTP belum dikonfigurasi (SMTP_HOST kosong). Email tidak benar-benar terkirim.\n` +
        `To: ${input.to}\nSubject: ${input.subject}\n${input.html}`
    );
    return { delivered: false, mode: "console" as const };
  }

  await transporter.sendMail({
    from: apiConfig.smtp.from,
    to: input.to,
    subject: input.subject,
    html: input.html
  });
  return { delivered: true, mode: "smtp" as const };
};

export const buildVerificationEmail = (name: string, verifyUrl: string) => ({
  subject: "Verifikasi Email — Lentera Pasar",
  html: `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2>Halo, ${name}</h2>
      <p>Terima kasih sudah mendaftar di Lentera Pasar. Klik tombol di bawah untuk verifikasi alamat email kamu:</p>
      <p style="margin:24px 0;">
        <a href="${verifyUrl}" style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Verifikasi Email
        </a>
      </p>
      <p>Atau salin link berikut ke browser kamu:<br/>${verifyUrl}</p>
      <p style="color:#64748b;font-size:13px;">Link ini berlaku 24 jam. Kalau kamu tidak merasa mendaftar, abaikan email ini.</p>
    </div>
  `
});

export const buildPasswordResetEmail = (name: string, resetUrl: string) => ({
  subject: "Reset Password — Lentera Pasar",
  html: `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2>Halo, ${name}</h2>
      <p>Kami menerima permintaan reset password untuk akun kamu. Klik tombol di bawah untuk membuat password baru:</p>
      <p style="margin:24px 0;">
        <a href="${resetUrl}" style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Reset Password
        </a>
      </p>
      <p>Atau salin link berikut ke browser kamu:<br/>${resetUrl}</p>
      <p style="color:#64748b;font-size:13px;">Link ini berlaku 1 jam. Kalau kamu tidak meminta reset password, abaikan email ini — password kamu tetap aman.</p>
    </div>
  `
});

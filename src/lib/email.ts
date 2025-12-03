import { Resend } from 'resend';

// Only initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!resend) {
    console.warn('Resend API key not configured. Email not sent.');
    throw new Error('Email service not configured');
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'PERON.ID <onboarding@resend.dev>', // Change to your verified domain
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send email');
    }

    return data;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

export function getPasswordResetEmailTemplate(resetUrl: string, userName?: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #000;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Reset Kata Sandi - PERON.ID</h2>
        ${userName ? `<p>Halo ${userName},</p>` : '<p>Halo,</p>'}
        <p>Kami menerima permintaan untuk reset kata sandi akun Anda di PERON.ID.</p>
        <p>Klik tombol di bawah ini untuk reset kata sandi Anda:</p>
        <a href="${resetUrl}" class="button">Reset Kata Sandi</a>
        <p>Atau salin dan tempel link berikut ke browser Anda:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p><strong>Link ini akan kadaluarsa dalam 1 jam.</strong></p>
        <p>Jika Anda tidak meminta reset kata sandi, abaikan email ini. Kata sandi Anda tidak akan berubah.</p>
        <div class="footer">
          <p>Email ini dikirim oleh PERON.ID</p>
          <p>Jangan balas email ini. Email ini dikirim secara otomatis.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

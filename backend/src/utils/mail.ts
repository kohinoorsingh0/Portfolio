import nodemailer from "nodemailer";

export interface SendContactNotificationParams {
  name: string;
  email: string;
  message: string;
  ip?: string;
}

export const sendContactNotification = async ({
  name,
  email,
  message,
}: SendContactNotificationParams): Promise<boolean> => {
  const contactEmail = process.env.CONTACT_EMAIL;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!contactEmail || !smtpUser || !smtpPass) {
    console.warn(
      "[mail] SMTP credentials not fully configured; skipping email notification."
    );
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `Portfolio Contact Form <${smtpUser}>`,
      to: contactEmail,
      replyTo: email,
      subject: `[Portfolio Contact] New message from ${name}`,
      text: `You received a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
          <h2>New Portfolio Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
        </div>
      `,
    });

    console.log(`[mail] Notification sent successfully to ${contactEmail}`);
    return true;
  } catch (error) {
    console.error(
      "[mail] Failed to send email notification:",
      (error as Error).message
    );
    return false;
  }
};

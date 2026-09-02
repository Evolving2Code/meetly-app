type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail(
  params: SendEmailParams,
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Meetly <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not configured; skipping send to", params.to);
    return { sent: false, error: "Email not configured" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    return {
      sent: false,
      error: typeof data.message === "string" ? data.message : "Failed to send email",
    };
  }

  return { sent: true };
}

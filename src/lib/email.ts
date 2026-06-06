import { CONTACT } from "./constants";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function sendEmailNotification({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  console.log(`[EMAIL NOTIFICATION] to: ${to} | subject: ${subject}`);
  
  if (!RESEND_API_KEY || RESEND_API_KEY === "re_123456789") {
    console.log("[EMAIL] Resend API key is mock or missing, printing contents in developer console:");
    console.log(html);
    return { success: true, message: "Logged notification in terminal console (mock mode)" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Sauraha Resort <no-reply@saurahafishvillage.com>`,
        to,
        subject,
        html,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.error("[EMAIL] Resend service response error:", errorText);
      return { success: false, error: errorText };
    }
  } catch (error: any) {
    console.error("[EMAIL] Resend service failed connection:", error);
    return { success: false, error: error.message };
  }
}

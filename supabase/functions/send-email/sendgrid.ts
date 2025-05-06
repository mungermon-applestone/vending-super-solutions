
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

// Create Supabase client to access secrets
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// SendGrid email sending function
export async function sendEmail(params: {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
  form_type?: string;
  page_url?: string;
}) {
  try {
    // Get SendGrid API key from Supabase secrets
    const { data, error } = await supabaseClient
      .from("secrets")
      .select("value")
      .eq("name", "lKDm5XiLTi2mX7YmHjWu")
      .single();

    if (error || !data) {
      console.error("Error fetching SendGrid API key:", error);
      throw new Error("Could not retrieve API key");
    }

    const SENDGRID_API_KEY = data.value;

    // Prepare the email
    const msg = {
      // Update these email addresses with your actual verified email in SendGrid
      to: "your-verified-email@example.com", // Change this to your recipient email
      from: "your-verified-email@example.com", // Change this to your verified sender email in SendGrid
      subject: params.subject,
      text: params.message,
      html: `
        <div>
          <h3>${params.subject}</h3>
          <p><strong>From:</strong> ${params.from_name} (${params.from_email})</p>
          <p><strong>Message:</strong></p>
          <p>${params.message}</p>
          ${params.form_type ? `<p><strong>Form Type:</strong> ${params.form_type}</p>` : ''}
          ${params.page_url ? `<p><strong>Page URL:</strong> ${params.page_url}</p>` : ''}
        </div>
      `,
    };

    // Send the email using the SendGrid API
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: msg.to }] }],
        from: { email: msg.from },
        subject: msg.subject,
        content: [
          { type: "text/plain", value: msg.text },
          { type: "text/html", value: msg.html }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid API error: ${response.status} ${errorText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("SendGrid error:", error);
    throw error;
  }
}

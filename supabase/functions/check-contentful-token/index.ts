import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AwsClient } from "https://esm.sh/aws4fetch@1.0.16";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WARN_DAYS = [14, 7, 3, 1];

async function sendAlert(subject: string, body: string) {
  const region = Deno.env.get("AWS_REGION");
  const accessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID");
  const secretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
  const from = Deno.env.get("SES_FROM_EMAIL");
  const to = Deno.env.get("CONTENTFUL_ALERT_EMAIL") ?? Deno.env.get("EMAIL_TO");

  if (!region || !accessKeyId || !secretAccessKey || !from || !to) {
    console.error("[check-contentful-token] Missing SES env vars; cannot send alert");
    return false;
  }

  const aws = new AwsClient({
    region,
    service: "ses",
    accessKeyId: accessKeyId.trim(),
    secretAccessKey: secretAccessKey.trim(),
  });

  const params = new URLSearchParams();
  params.set("Action", "SendEmail");
  params.set("Source", from);
  params.set("Destination.ToAddresses.member.1", to);
  params.set("Message.Subject.Data", subject);
  params.set("Message.Body.Text.Data", body);

  const res = await aws.fetch(`https://email.${region}.amazonaws.com/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!res.ok) {
    console.error("[check-contentful-token] SES send failed", res.status, await res.text());
    return false;
  }
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const spaceId = Deno.env.get("CONTENTFUL_SPACE_ID") ?? Deno.env.get("VITE_CONTENTFUL_SPACE_ID");
  const envId = Deno.env.get("CONTENTFUL_ENVIRONMENT_ID") ?? Deno.env.get("VITE_CONTENTFUL_ENVIRONMENT_ID") ?? "master";
  const token = Deno.env.get("VITE_CONTENTFUL_DELIVERY_TOKEN");
  const expiresAtRaw = Deno.env.get("CONTENTFUL_TOKEN_EXPIRES_AT"); // optional ISO date

  const report: Record<string, unknown> = { ok: true, checks: [] as unknown[] };

  if (!spaceId || !token) {
    const msg = "Missing CONTENTFUL_SPACE_ID or VITE_CONTENTFUL_DELIVERY_TOKEN";
    await sendAlert("[ALERT] Contentful token check misconfigured", msg);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 1. Live API ping
  const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/content_types?limit=1`;
  const apiRes = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const apiCheck = { type: "api_ping", status: apiRes.status, ok: apiRes.ok };
  (report.checks as unknown[]).push(apiCheck);

  if (!apiRes.ok) {
    report.ok = false;
    const bodyText = await apiRes.text().catch(() => "");
    await sendAlert(
      `[URGENT] Contentful delivery token rejected (HTTP ${apiRes.status})`,
      `The live site's Contentful token failed validation.\n\n` +
        `Space: ${spaceId}\nEnvironment: ${envId}\nStatus: ${apiRes.status}\n\n` +
        `Response: ${bodyText.slice(0, 500)}\n\n` +
        `Action: rotate the CDA token in Contentful and update Lovable per docs/contentful-token-rotation.md.`,
    );
  }

  // 2. Expiry date warning
  if (expiresAtRaw) {
    const expiresAt = new Date(expiresAtRaw);
    if (!isNaN(expiresAt.getTime())) {
      const msLeft = expiresAt.getTime() - Date.now();
      const daysLeft = Math.floor(msLeft / 86_400_000);
      const expiryCheck = { type: "expiry", expiresAt: expiresAt.toISOString(), daysLeft };
      (report.checks as unknown[]).push(expiryCheck);

      if (daysLeft < 0) {
        await sendAlert(
          "[URGENT] Contentful token EXPIRED",
          `CONTENTFUL_TOKEN_EXPIRES_AT was ${expiresAt.toISOString()} (${-daysLeft} days ago). Rotate immediately.`,
        );
      } else if (WARN_DAYS.includes(daysLeft)) {
        await sendAlert(
          `[Heads up] Contentful token expires in ${daysLeft} day(s)`,
          `The CDA token expires on ${expiresAt.toISOString()}.\n\n` +
            `Rotate via docs/contentful-token-rotation.md before then to avoid downtime.`,
        );
      }
    }
  } else {
    (report.checks as unknown[]).push({
      type: "expiry",
      note: "CONTENTFUL_TOKEN_EXPIRES_AT not set — only live-ping monitoring is active.",
    });
  }

  return new Response(JSON.stringify(report), {
    status: report.ok ? 200 : 502,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

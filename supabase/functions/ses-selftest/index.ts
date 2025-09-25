import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AwsClient } from "https://esm.sh/aws4fetch@1.0.16";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function createAws(region: string, accessKeyId: string, secretAccessKey: string) {
  return new AwsClient({
    region,
    service: "ses",
    accessKeyId: accessKeyId.trim(),
    secretAccessKey: secretAccessKey.trim(),
  });
}

async function callSes(actionParams: URLSearchParams, region: string, aws: AwsClient) {
  const primary = `https://email.${region}.amazonaws.com/`;
  const fallback = `https://ses.${region}.amazonaws.com/`;
  const body = actionParams.toString();
  const headers = { "Content-Type": "application/x-www-form-urlencoded" } as const;

  async function sendTo(endpoint: string) {
    console.log(`[ses-selftest] Calling SES ${endpoint} with action`, actionParams.get("Action"));
    const res = await aws.fetch(endpoint, { method: "POST", headers, body });
    const text = await res.text();
    if (!res.ok) throw new Error(`SES error (${endpoint}): ${res.status} ${res.statusText} - ${text}`);
    return { endpoint, text };
  }

  try {
    return await sendTo(primary);
  } catch (e) {
    console.error("[ses-selftest] Primary failed:", e);
    return await sendTo(fallback);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const modeParam = url.searchParams.get("mode");
    let mode = modeParam || "quota";
    let toOverride = url.searchParams.get("to") || "";

    if (!modeParam && (req.method === "POST" || req.method === "PUT")) {
      try {
        const body = await req.json();
        mode = body.mode || mode;
        toOverride = body.to || toOverride;
      } catch {}
    }

    const region = Deno.env.get("AWS_REGION") || "us-east-1";
    const accessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID") || "";
    const secretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY") || "";
    const emailFrom = Deno.env.get("SES_FROM_EMAIL") || "";
    const emailTo = toOverride || Deno.env.get("EMAIL_TO") || "";

    if (!accessKeyId || !secretAccessKey) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing AWS credentials" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const aws = createAws(region, accessKeyId, secretAccessKey);

    let params = new URLSearchParams();
    if (mode === "quota") {
      params.set("Action", "GetSendQuota");
      params.set("Version", "2010-12-01");
    } else if (mode === "stats") {
      params.set("Action", "GetSendStatistics");
      params.set("Version", "2010-12-01");
    } else if (mode === "test-email") {
      if (!emailFrom || !emailTo) {
        return new Response(
          JSON.stringify({ ok: false, error: "Missing SES_FROM_EMAIL or EMAIL_TO" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      params.set("Action", "SendEmail");
      params.set("Version", "2010-12-01");
      params.set("Source", emailFrom);
      params.set("Destination.ToAddresses.member.1", emailTo);
      params.set("Message.Subject.Data", "SES Self-Test Email");
      params.set("Message.Subject.Charset", "UTF-8");
      params.set("Message.Body.Text.Data", "This is a test email from ses-selftest.");
      params.set("Message.Body.Text.Charset", "UTF-8");
    } else {
      return new Response(
        JSON.stringify({ ok: false, error: `Unknown mode: ${mode}` }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { endpoint, text } = await callSes(params, region, aws);

    return new Response(
      JSON.stringify({ ok: true, mode, region, endpointUsed: endpoint, sesResponse: text }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("[ses-selftest] Error:", error);
    return new Response(
      JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
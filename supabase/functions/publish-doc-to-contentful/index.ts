import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface StepInput {
  publicUrl: string;
  description: string;
  order: number;
}

interface RequestBody {
  articleTitle: string;
  sectionCategory?: string;
  headingCategory?: string;
  publishImmediately: boolean;
  steps: StepInput[];
}

// ── Contentful helpers ──

async function createContentfulAsset(
  publicUrl: string,
  title: string,
  baseUrl: string,
  headers: Record<string, string>
): Promise<string> {
  const createRes = await fetch(`${baseUrl}/assets`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      fields: {
        title: { "en-US": title },
        file: {
          "en-US": {
            contentType: "image/png",
            fileName: `${title.replace(/\s+/g, "-").toLowerCase()}.png`,
            upload: publicUrl,
          },
        },
      },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Contentful asset creation failed: ${err}`);
  }

  const asset = await createRes.json();
  const assetId = asset.sys.id;
  let version = asset.sys.version;

  // Process asset
  const processRes = await fetch(
    `${baseUrl}/assets/${assetId}/files/en-US/process`,
    {
      method: "PUT",
      headers: { ...headers, "X-Contentful-Version": String(version) },
    }
  );

  if (!processRes.ok) {
    const err = await processRes.text();
    throw new Error(`Contentful asset processing failed: ${err}`);
  }

  // Wait for processing
  let processed = false;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const checkRes = await fetch(`${baseUrl}/assets/${assetId}`, { headers });
    const checkData = await checkRes.json();
    if (checkData.fields?.file?.["en-US"]?.url) {
      version = checkData.sys.version;
      processed = true;
      break;
    }
  }

  if (!processed) throw new Error("Asset processing timed out");

  // Publish asset
  const pubRes = await fetch(`${baseUrl}/assets/${assetId}/published`, {
    method: "PUT",
    headers: { ...headers, "X-Contentful-Version": String(version) },
  });

  if (!pubRes.ok) {
    const err = await pubRes.text();
    throw new Error(`Contentful asset publish failed: ${err}`);
  }

  return assetId;
}

function buildRichTextDocument(
  assetIds: string[],
  descriptions: string[]
): object {
  const content: unknown[] = [];

  assetIds.forEach((assetId, index) => {
    content.push({
      nodeType: "embedded-asset-block",
      data: {
        target: {
          sys: { id: assetId, type: "Link", linkType: "Asset" },
        },
      },
      content: [],
    });

    const text =
      descriptions[index]?.trim() ||
      `Step ${index + 1}: Describe what the user should do here.`;
    const marks = descriptions[index]?.trim() ? [] : [{ type: "italic" }];

    content.push({
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: text, marks, data: {} }],
    });
  });

  return { nodeType: "document", data: {}, content };
}

// ── Main handler ──

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;

    // Admin check
    const { data: isAdmin } = await supabase.rpc("is_admin", { uid: userId });
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse body
    const body: RequestBody = await req.json();
    const {
      articleTitle,
      sectionCategory,
      headingCategory,
      publishImmediately,
      steps,
    } = body;

    if (!articleTitle || !steps?.length) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing articleTitle or steps" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Contentful config from secrets
    const managementToken =
      Deno.env.get("VITE_CONTENTFUL_MANAGEMENT_TOKEN") ||
      Deno.env.get("CONTENTFUL_MANAGEMENT_TOKEN");
    const spaceId =
      Deno.env.get("CONTENTFUL_SPACE_ID") ||
      Deno.env.get("VITE_CONTENTFUL_SPACE_ID");
    const environmentId =
      Deno.env.get("VITE_CONTENTFUL_ENVIRONMENT_ID") ||
      Deno.env.get("CONTENTFUL_ENVIRONMENT_ID") ||
      "master";

    if (!managementToken || !spaceId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Contentful management token or space ID not configured",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const baseUrl = `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}`;
    const cfHeaders = {
      Authorization: `Bearer ${managementToken}`,
      "Content-Type": "application/vnd.contentful.management.v1+json",
    };

    // Sort steps
    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

    // Create Contentful assets
    console.log(
      `[publish-doc-to-contentful] Creating ${sortedSteps.length} assets…`
    );
    const assetIds: string[] = [];
    for (let i = 0; i < sortedSteps.length; i++) {
      const assetId = await createContentfulAsset(
        sortedSteps[i].publicUrl,
        `${articleTitle} - Step ${i + 1}`,
        baseUrl,
        cfHeaders
      );
      assetIds.push(assetId);
    }

    // Build rich text and create entry
    const descriptions = sortedSteps.map((s) => s.description || "");
    const richText = buildRichTextDocument(assetIds, descriptions);

    const entryHeaders = {
      ...cfHeaders,
      "X-Contentful-Content-Type": "helpDeskArticle",
    };

    const entryFields: Record<string, unknown> = {
      articleTitle: { "en-US": articleTitle },
      articleContent: { "en-US": richText },
    };

    if (sectionCategory) {
      entryFields.sectionCategory = { "en-US": sectionCategory };
    }
    if (headingCategory) {
      entryFields.headingCategory = { "en-US": headingCategory };
    }

    const entryRes = await fetch(`${baseUrl}/entries`, {
      method: "POST",
      headers: entryHeaders,
      body: JSON.stringify({ fields: entryFields }),
    });

    if (!entryRes.ok) {
      const err = await entryRes.text();
      throw new Error(`Entry creation failed: ${err}`);
    }

    const entry = await entryRes.json();
    const entryId = entry.sys.id;

    // Optionally publish
    if (publishImmediately) {
      console.log("[publish-doc-to-contentful] Publishing entry…");
      const pubRes = await fetch(`${baseUrl}/entries/${entryId}/published`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${managementToken}`,
          "X-Contentful-Version": String(entry.sys.version),
        },
      });
      if (!pubRes.ok) {
        console.warn("[publish-doc-to-contentful] Publish failed, entry saved as draft");
      }
    }

    console.log(`[publish-doc-to-contentful] Success! Entry ID: ${entryId}`);
    return new Response(
      JSON.stringify({ success: true, entryId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[publish-doc-to-contentful] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

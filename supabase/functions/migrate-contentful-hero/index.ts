import contentfulManagement from 'https://esm.sh/contentful-management@11.52.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MigrationResult {
  success: boolean;
  entryId: string;
  entryTitle?: string;
  message: string;
  sourceTextLength?: number;
}

interface MigrationSummary {
  success: boolean;
  totalEntries: number;
  successCount: number;
  skipCount: number;
  errorCount: number;
  results: MigrationResult[];
  errors: string[];
}

/**
 * Convert plain text to Contentful RichText Document format
 */
function textToRichText(text: string) {
  if (!text) return null;
  
  // Split text into paragraphs (on double line breaks)
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  
  return {
    nodeType: 'document',
    data: {},
    content: paragraphs.map(paragraph => ({
      nodeType: 'paragraph',
      data: {},
      content: [{
        nodeType: 'text',
        value: paragraph.trim(),
        marks: [],
        data: {}
      }]
    }))
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting Contentful hero description migration');

    // Get Contentful credentials from environment
    const SPACE_ID = Deno.env.get('CONTENTFUL_SPACE_ID');
    const ENVIRONMENT_ID = Deno.env.get('CONTENTFUL_ENVIRONMENT_ID') || 'master';
    const MANAGEMENT_TOKEN = Deno.env.get('CONTENTFUL_MANAGEMENT_TOKEN');

    if (!SPACE_ID || !MANAGEMENT_TOKEN) {
      throw new Error('Missing required Contentful credentials (SPACE_ID or MANAGEMENT_TOKEN)');
    }

    console.log(`📡 Connecting to Contentful space: ${SPACE_ID}, environment: ${ENVIRONMENT_ID}`);

    // Configuration
    const CONTENT_TYPE_ID = 'businessGoal';
    const SOURCE_FIELD = 'heroDescription';
    const TARGET_FIELD = 'heroDescription2';

    // Create Contentful Management client
    const client = contentfulManagement.createClient({
      accessToken: MANAGEMENT_TOKEN
    });

    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    console.log('✅ Connected to Contentful successfully');

    // Fetch all entries of the content type
    console.log(`📥 Fetching ${CONTENT_TYPE_ID} entries...`);
    const entriesResponse = await environment.getEntries({
      content_type: CONTENT_TYPE_ID,
      limit: 1000
    });

    const entries = entriesResponse.items;
    console.log(`Found ${entries.length} entries to process`);

    if (entries.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No entries found to migrate',
          totalEntries: 0,
          successCount: 0,
          skipCount: 0,
          errorCount: 0,
          results: [],
          errors: []
        } as MigrationSummary),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // Process each entry
    const results: MigrationResult[] = [];
    const errors: string[] = [];
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const entry of entries) {
      const entryId = entry.sys.id;
      const sourceText = entry.fields[SOURCE_FIELD]?.['en-US'];
      const targetExists = entry.fields[TARGET_FIELD]?.['en-US'];
      const entryTitle = entry.fields.title?.['en-US'] || entryId;

      console.log(`\n📝 Processing entry: ${entryId} (${entryTitle})`);

      // Skip if source is empty
      if (!sourceText) {
        console.log(`   ⏭️  Skipping - ${SOURCE_FIELD} is empty`);
        results.push({
          success: true,
          entryId,
          entryTitle,
          message: 'Skipped: source field is empty'
        });
        skipCount++;
        continue;
      }

      // Skip if target already has content
      if (targetExists) {
        console.log(`   ⏭️  Skipping - ${TARGET_FIELD} already has content`);
        results.push({
          success: true,
          entryId,
          entryTitle,
          message: 'Skipped: target field already populated'
        });
        skipCount++;
        continue;
      }

      try {
        // Convert text to RichText format
        const richTextContent = textToRichText(sourceText);
        
        console.log(`   📄 Converting ${sourceText.length} characters to RichText`);
        
        // Update the entry
        entry.fields[TARGET_FIELD] = {
          'en-US': richTextContent
        };

        // Save the entry
        const updatedEntry = await entry.update();
        
        // Publish if the entry was previously published
        if (entry.sys.publishedVersion) {
          console.log(`   📤 Publishing entry...`);
          await updatedEntry.publish();
        }

        console.log(`   ✅ Successfully migrated`);
        results.push({
          success: true,
          entryId,
          entryTitle,
          message: 'Successfully migrated and published',
          sourceTextLength: sourceText.length
        });
        successCount++;
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`   ❌ Error migrating entry:`, errorMessage);
        
        results.push({
          success: false,
          entryId,
          entryTitle,
          message: `Error: ${errorMessage}`
        });
        errors.push(`Entry ${entryId} (${entryTitle}): ${errorMessage}`);
        errorCount++;
      }
    }

    // Prepare summary
    const summary: MigrationSummary = {
      success: errorCount === 0,
      totalEntries: entries.length,
      successCount,
      skipCount,
      errorCount,
      results,
      errors
    };

    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📦 Total entries: ${entries.length}`);
    console.log('='.repeat(60));

    return new Response(
      JSON.stringify(summary),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Migration failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        message: 'Migration failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

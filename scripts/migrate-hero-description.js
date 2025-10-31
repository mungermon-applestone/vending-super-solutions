/**
 * Migration Script: Copy heroDescription to heroDescription2
 * 
 * This script migrates content from the plain text heroDescription field
 * to the new RichText heroDescription2 field in Contentful.
 * 
 * Prerequisites:
 * 1. Add heroDescription2 field (type: RichText) to businessGoalsPageContent in Contentful
 * 2. Set environment variables or update the config below
 * 
 * Usage:
 *   node scripts/migrate-hero-description.js
 */

const contentfulManagement = require('contentful-management');

// ============== CONFIGURATION ==============
// Option 1: Set these environment variables
// CONTENTFUL_SPACE_ID=your-space-id
// CONTENTFUL_ENVIRONMENT_ID=master
// CONTENTFUL_MANAGEMENT_TOKEN=your-management-token

// Option 2: Or hardcode them here (not recommended for production)
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || 'YOUR_SPACE_ID';
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN || 'YOUR_MANAGEMENT_TOKEN';

// Content type to migrate
const CONTENT_TYPE_ID = 'businessGoalsPageContent';
const SOURCE_FIELD = 'heroDescription';
const TARGET_FIELD = 'heroDescription2';

// ============== HELPER FUNCTIONS ==============

/**
 * Convert plain text to Contentful RichText Document format
 */
function textToRichText(text) {
  if (!text) return null;
  
  // Split text into paragraphs
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

/**
 * Main migration function
 */
async function migrateHeroDescription() {
  console.log('🚀 Starting migration...');
  console.log(`Space: ${SPACE_ID}`);
  console.log(`Environment: ${ENVIRONMENT_ID}`);
  console.log(`Content Type: ${CONTENT_TYPE_ID}`);
  console.log('');

  try {
    // 1. Create Contentful Management client
    console.log('📡 Connecting to Contentful...');
    const client = contentfulManagement.createClient({
      accessToken: MANAGEMENT_TOKEN
    });

    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    console.log('✅ Connected successfully\n');

    // 2. Fetch all entries of the content type
    console.log(`📥 Fetching all ${CONTENT_TYPE_ID} entries...`);
    const entries = await environment.getEntries({
      content_type: CONTENT_TYPE_ID,
      limit: 1000 // Adjust if you have more than 1000 entries
    });

    console.log(`Found ${entries.items.length} entries\n`);

    if (entries.items.length === 0) {
      console.log('⚠️  No entries found. Exiting.');
      return;
    }

    // 3. Migrate each entry
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const entry of entries.items) {
      const entryId = entry.sys.id;
      const sourceText = entry.fields[SOURCE_FIELD]?.['en-US'];
      const targetExists = entry.fields[TARGET_FIELD]?.['en-US'];

      console.log(`\n📝 Processing entry: ${entryId}`);
      
      // Skip if source is empty
      if (!sourceText) {
        console.log(`   ⏭️  Skipping - ${SOURCE_FIELD} is empty`);
        skipCount++;
        continue;
      }

      // Skip if target already has content (safety check)
      if (targetExists) {
        console.log(`   ⏭️  Skipping - ${TARGET_FIELD} already has content`);
        skipCount++;
        continue;
      }

      try {
        // Convert text to RichText format
        const richTextContent = textToRichText(sourceText);
        
        console.log(`   📄 Source text (${sourceText.length} chars): "${sourceText.substring(0, 60)}..."`);
        
        // Update the entry
        entry.fields[TARGET_FIELD] = {
          'en-US': richTextContent
        };

        // Save the entry
        const updatedEntry = await entry.update();
        
        // Publish if the entry was published
        if (entry.sys.publishedVersion) {
          console.log(`   📤 Publishing entry...`);
          await updatedEntry.publish();
        }

        console.log(`   ✅ Successfully migrated`);
        successCount++;
        
      } catch (error) {
        console.error(`   ❌ Error migrating entry:`, error.message);
        errorCount++;
      }
    }

    // 4. Summary
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📦 Total entries: ${entries.items.length}`);
    console.log('='.repeat(60));
    
    if (successCount > 0) {
      console.log('\n✨ Migration completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Verify the migrated content in Contentful');
      console.log('2. Update your code to use heroDescription2 field');
      console.log('3. Delete the old heroDescription field in Contentful');
      console.log('4. (Optional) Rename heroDescription2 to heroDescription in Contentful');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateHeroDescription()
  .then(() => {
    console.log('\n✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Unhandled error:', error);
    process.exit(1);
  });

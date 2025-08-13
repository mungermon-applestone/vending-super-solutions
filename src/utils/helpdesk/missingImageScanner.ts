import { contentfulHelpDeskArticleAdapter } from '@/services/cms/adapters/helpDeskArticles/contentfulHelpDeskArticleAdapter';
import { BLOCKS } from '@contentful/rich-text-types';

export interface MissingImageInfo {
  assetId?: string;
  nodeType: string;
  position: number;
  context: string;
}

export interface ArticleWithMissingImages {
  id: string;
  title: string;
  missingImages: MissingImageInfo[];
  totalImages: number;
  editUrl?: string;
}

export interface MissingImageScanResult {
  articlesWithMissingImages: ArticleWithMissingImages[];
  totalArticlesScanned: number;
  totalMissingImages: number;
  scanTimestamp: Date;
}

/**
 * Recursively traverse rich text content to find embedded assets
 */
function findEmbeddedAssets(content: any, path: string = ''): Array<{node: any, position: number, context: string}> {
  const assets: Array<{node: any, position: number, context: string}> = [];
  
  if (!content || typeof content !== 'object') {
    return assets;
  }

  // Check if this is an embedded asset node
  if (content.nodeType === BLOCKS.EMBEDDED_ASSET) {
    assets.push({
      node: content,
      position: assets.length,
      context: path
    });
  }

  // Recursively check content array
  if (Array.isArray(content.content)) {
    content.content.forEach((child: any, index: number) => {
      const childAssets = findEmbeddedAssets(child, `${path}/content[${index}]`);
      assets.push(...childAssets);
    });
  }

  return assets;
}

/**
 * Check if an embedded asset is missing or invalid
 */
function isAssetMissing(assetNode: any, includedAssets: any[] = []): boolean {
  // Check if asset has target reference
  if (!assetNode.data?.target?.sys?.id) {
    return true; // Missing asset reference
  }

  const assetId = assetNode.data.target.sys.id;
  
  // Check if asset exists in includes
  const asset = includedAssets.find(a => a?.sys?.id === assetId);
  if (!asset) {
    return true; // Asset not found in includes
  }

  // Check if asset has valid file data
  if (!asset.fields?.file?.url) {
    return true; // Asset missing file URL
  }

  return false; // Asset appears to be valid
}

/**
 * Scan a single article for missing images
 */
function scanArticleForMissingImages(article: any): ArticleWithMissingImages {
  const missingImages: MissingImageInfo[] = [];
  const embeddedAssets = findEmbeddedAssets(article.fields.articleContent);
  const includedAssets = article.includes?.Asset || [];

  embeddedAssets.forEach((assetInfo, index) => {
    if (isAssetMissing(assetInfo.node, includedAssets)) {
      missingImages.push({
        assetId: assetInfo.node.data?.target?.sys?.id,
        nodeType: assetInfo.node.nodeType,
        position: index,
        context: assetInfo.context
      });
    }
  });

  return {
    id: article.sys.id,
    title: article.fields.articleTitle || 'Untitled Article',
    missingImages,
    totalImages: embeddedAssets.length
  };
}

/**
 * Scan all help desk articles for missing images
 */
export async function scanHelpDeskArticlesForMissingImages(): Promise<MissingImageScanResult> {
  try {
    console.log('[missingImageScanner] Starting scan of help desk articles');
    
    const articles = await contentfulHelpDeskArticleAdapter.getAll();
    console.log(`[missingImageScanner] Found ${articles.length} articles to scan`);

    const articlesWithMissingImages: ArticleWithMissingImages[] = [];
    let totalMissingImages = 0;

    for (const article of articles) {
      const scanResult = scanArticleForMissingImages(article);
      
      if (scanResult.missingImages.length > 0) {
        articlesWithMissingImages.push(scanResult);
        totalMissingImages += scanResult.missingImages.length;
        
        console.log(`[missingImageScanner] Found ${scanResult.missingImages.length} missing images in article: ${scanResult.title}`);
      }
    }

    const result: MissingImageScanResult = {
      articlesWithMissingImages,
      totalArticlesScanned: articles.length,
      totalMissingImages,
      scanTimestamp: new Date()
    };

    console.log('[missingImageScanner] Scan complete:', {
      totalArticles: result.totalArticlesScanned,
      articlesWithIssues: result.articlesWithMissingImages.length,
      totalMissingImages: result.totalMissingImages
    });

    return result;
  } catch (error) {
    console.error('[missingImageScanner] Error during scan:', error);
    throw error;
  }
}
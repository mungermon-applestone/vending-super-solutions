import React from 'react';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { ContentfulAsset } from '@/types/contentful';

// Helper function to normalize Contentful URLs
export const normalizeContentfulUrl = (url: string): string => {
  if (!url) return '';
  return url.startsWith('//') 
    ? `https:${url}` 
    : url.startsWith('http') ? url : `https:${url}`;
};

// Append responsive sizing and modern format params to a Contentful image URL
export const buildContentfulImageUrl = (url: string, widthPx?: number): string => {
  const base = normalizeContentfulUrl(url);
  if (!base) return '';
  const params = new URLSearchParams();
  if (widthPx && widthPx > 0) params.set('w', String(widthPx));
  params.set('fm', 'webp');
  params.set('q', '80');
  const query = params.toString();
  return query ? `${base}?${query}` : base;
};

interface ImageLayoutHints {
  width: number;
  align: 'left' | 'center' | 'right';
  wrap: boolean;
  caption: string;
}

const VALID_WIDTHS = [25, 33, 50, 66, 75, 100] as const;
type ValidWidth = typeof VALID_WIDTHS[number];

const WIDTH_CLASS_MAP: Record<ValidWidth, string> = {
  25: 'w-full sm:w-1/4',
  33: 'w-full sm:w-1/3',
  50: 'w-full sm:w-1/2',
  66: 'w-full sm:w-2/3',
  75: 'w-full sm:w-3/4',
  100: 'w-full',
};

const DEFAULT_CONTENT_WIDTH_PX = 1200;

// Parse layout tokens out of an asset description.
// Example: "Storefront cabinet | width:50 align:right wrap"
export const parseImageLayoutHints = (description?: string): ImageLayoutHints => {
  if (!description) {
    return { width: 100, align: 'center', wrap: false, caption: '' };
  }

  const tokens = description.split(/\s+/).filter(Boolean);
  let width: ValidWidth = 100;
  let align: 'left' | 'center' | 'right' = 'center';
  let wrap = false;
  const consumed: number[] = [];

  tokens.forEach((token, i) => {
    const widthMatch = token.match(/^width:(\d+)$/i);
    if (widthMatch) {
      const value = parseInt(widthMatch[1], 10);
      if (VALID_WIDTHS.includes(value as ValidWidth)) {
        width = value as ValidWidth;
        consumed.push(i);
      }
      return;
    }

    const alignMatch = token.match(/^align:(left|center|right)$/i);
    if (alignMatch) {
      align = alignMatch[1].toLowerCase() as 'left' | 'center' | 'right';
      consumed.push(i);
      return;
    }

    if (/^wrap$/i.test(token)) {
      wrap = true;
      consumed.push(i);
    }
  });

  const caption = tokens
    .filter((_, i) => !consumed.includes(i))
    .join(' ')
    .replace(/\s*\|\s*$/, '')
    .trim();

  return { width, align, wrap, caption };
};

// Helper to find an asset using multiple strategies
export const findContentfulAsset = (
  assetId: string,
  includedAssets: ContentfulAsset[],
  contentIncludes?: { Asset?: ContentfulAsset[] },
  nodeData?: any
): ContentfulAsset | null => {
  // Strategy 1: Direct lookup in includedAssets
  let asset = includedAssets.find(a => a.sys.id === assetId);

  // Strategy 2: Check node data for direct file references
  if (!asset && nodeData?.target?.fields?.file) {
    asset = {
      sys: { id: assetId },
      fields: nodeData.target.fields
    };
  }

  // Strategy 3: Look through content includes
  if (!asset && contentIncludes?.Asset) {
    asset = contentIncludes.Asset.find(a => 
      a.sys.id === assetId || 
      a.fields.file?.url?.includes(assetId)
    );
  }

  return asset || null;
};

interface RichTextRendererOptions {
  includedAssets: ContentfulAsset[];
  contentIncludes?: { Asset?: ContentfulAsset[] };
}

export const getRichTextRenderOptions = ({ includedAssets, contentIncludes }: RichTextRendererOptions) => ({
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
      <p className="mb-4">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
      <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
      <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
      <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => (
      <h5 className="text-base font-bold mt-3 mb-1">{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => (
      <h6 className="text-sm font-bold mt-3 mb-1">{children}</h6>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
      <ul className="list-disc pl-6 mb-4">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
      <ol className="list-decimal pl-6 mb-4">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
      <li className="mb-1">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-6 border-t border-gray-300" />,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      try {
        const assetId = node.data?.target?.sys?.id;
        
        if (!assetId) {
          console.error('Missing asset ID in embedded asset node');
          return <div className="text-red-500">Image reference error (no ID)</div>;
        }

        const asset = findContentfulAsset(assetId, includedAssets, contentIncludes, node.data);
        
        if (!asset) {
          console.error(`Asset not found for ID: ${assetId}`);
          return <div className="text-red-500">Image not found (ID: {assetId})</div>;
        }

        const { title, file } = asset.fields;
        const description = (asset.fields as any).description as string | undefined;

        if (!file || !file.url) {
          console.error('Asset file or URL missing:', asset);
          return <div className="text-red-500">Image file data missing</div>;
        }

        const fullUrl = normalizeContentfulUrl(file.url);
        const hints = parseImageLayoutHints(description || (title as any));
        const altText = title || hints.caption || 'Content image';

        // Compute responsive width in pixels based on the hint.
        const responsiveWidthPx = Math.round((hints.width / 100) * DEFAULT_CONTENT_WIDTH_PX);
        const srcUrl = buildContentfulImageUrl(file.url, responsiveWidthPx);

        // Alignment classes.
        // Without wrap: center the block; with wrap: float and let text flow around it.
        let alignmentClasses = '';
        if (hints.wrap) {
          alignmentClasses = hints.align === 'left'
            ? 'float-left mr-6 mb-4'
            : hints.align === 'right'
              ? 'float-right ml-6 mb-4'
              : 'mx-auto mb-4';
        } else {
          alignmentClasses = hints.align === 'left'
            ? 'mr-auto'
            : hints.align === 'right'
              ? 'ml-auto'
              : 'mx-auto';
        }

        const widthClass = WIDTH_CLASS_MAP[hints.width];

        return (
          <figure className={`not-prose my-6 ${alignmentClasses} ${widthClass}`}>
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={srcUrl}
                alt={altText}
                loading="lazy"
                className="w-full h-auto max-h-[500px] object-contain bg-white"
              />
            </a>
            {hints.caption && (
              <figcaption className="mt-2 text-center text-sm text-gray-500">
                {hints.caption}
              </figcaption>
            )}
          </figure>
        );
      } catch (err) {
        console.error('Error rendering embedded asset:', err);
        return <div className="text-red-500">Error rendering asset: {String(err)}</div>;
      }
    },
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
      <a 
        href={node.data.uri} 
        className="text-blue-600 hover:underline" 
        target={node.data.uri.startsWith('http') ? '_blank' : '_self'} 
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <u>{text}</u>,
    [MARKS.CODE]: (text: React.ReactNode) => (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{text}</code>
    ),
  },
});

const NAMA_TITLE_MATCH = /nama/i;

const getPlainText = (node: any): string => {
  if (!node) return '';
  if (node.nodeType === 'text') return node.value || '';
  return (node.content || []).map(getPlainText).join('');
};

/**
 * Compact NAMA membership badge, matching the footer treatment.
 */
const NamaBadge: React.FC<{ src: string; alt: string; text: string }> = ({ src, alt, text }) => (
  <div className="not-prose mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center sm:text-left">
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="block self-center h-12 w-auto object-contain shrink-0"
    />
    <p className="self-center m-0 text-sm text-gray-500">{text}</p>
  </div>
);

export const renderRichText = (
  content: any,
  options: RichTextRendererOptions
) => {
  const nodes = content?.content;

  if (Array.isArray(nodes)) {
    const idx = nodes.findIndex((n: any) => {
      if (n?.nodeType !== 'embedded-asset-block') return false;
      const assetId = n.data?.target?.sys?.id;
      if (!assetId) return false;
      const asset = findContentfulAsset(assetId, options.includedAssets, options.contentIncludes, n.data);
      return NAMA_TITLE_MATCH.test(String(asset?.fields?.title || ''));
    });

    if (idx !== -1) {
      const assetNode = nodes[idx];
      const asset = findContentfulAsset(
        assetNode.data.target.sys.id,
        options.includedAssets,
        options.contentIncludes,
        assetNode.data
      );
      const url = normalizeContentfulUrl(asset?.fields?.file?.url || '');

      const next = nodes[idx + 1];
      const hasCaption = next?.nodeType === BLOCKS.PARAGRAPH && getPlainText(next).trim().length > 0;
      const text = hasCaption ? getPlainText(next).trim() : '';

      const remaining = nodes.filter((_: any, i: number) => i !== idx && !(hasCaption && i === idx + 1));
      const trimmedDoc = { ...content, content: remaining };

      return (
        <>
          {documentToReactComponents(trimmedDoc as any, getRichTextRenderOptions(options))}
          {url && (
            <NamaBadge
              src={url}
              alt={String((asset?.fields as any)?.description || asset?.fields?.title || 'NAMA membership')}
              text={text}
            />
          )}
        </>
      );
    }
  }

  return documentToReactComponents(content, getRichTextRenderOptions(options));
};

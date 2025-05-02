
/**
 * Utility functions for handling video content across the application
 */

export interface StandardVideoData {
  isVideo: boolean;
  videoUrl: string;
  thumbnailUrl: string;
  contentType: string;
  title: string;
  isDirectVideo: boolean;
  isExternalVideo: boolean;
  isYouTube: boolean;
  isVimeo: boolean;
}

/**
 * Ensures video URLs have proper protocol
 */
export function normalizeUrl(url: string | undefined | null): string {
  if (!url) return '';
  return url.startsWith('//') ? `https:${url}` : url;
}

/**
 * Detects content type based on video URL if not provided
 */
export function detectContentType(videoUrl?: string, providedContentType?: string): string {
  if (providedContentType) return providedContentType;
  
  if (videoUrl) {
    if (videoUrl.endsWith('.mp4')) return 'video/mp4';
    if (videoUrl.endsWith('.webm')) return 'video/webm';
    if (videoUrl.endsWith('.ogg')) return 'video/ogg';
    if (videoUrl.endsWith('.mov')) return 'video/quicktime';
  }
  
  return 'video/mp4'; // Default
}

/**
 * Processes video URL for embedding if it's YouTube or Vimeo
 */
export function getVideoEmbedUrl(url: string): string {
  if (!url) return '';
  
  // Make sure URL has proper protocol
  let processedUrl = normalizeUrl(url);
  
  // YouTube URLs
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1];
      const ampersandPosition = videoId?.indexOf('&');
      if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
      }
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
  }
  
  // Vimeo URLs
  if (url.includes('vimeo.com')) {
    const vimeoRegex = /vimeo\.com\/(\d+)($|\/|\?)/;
    const match = url.match(vimeoRegex);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
    }
  }
  
  return processedUrl;
}

/**
 * Checks if this is a direct video file (not an embed)
 */
export function isContentfulVideo(videoUrl?: string, contentType?: string): boolean {
  if (!videoUrl) return false;
  
  if (contentType && (contentType.includes('video/') || contentType.includes('application/'))) {
    return true;
  }
  
  // Check URL patterns
  if (videoUrl && (
    videoUrl.includes('videos.ctfassets.net') || 
    videoUrl.includes('.mp4') || 
    videoUrl.includes('.webm') || 
    videoUrl.includes('.mov')
  )) {
    return true;
  }
  
  return false;
}

/**
 * Standardizes video data from different sources into a common format
 */
export function standardizeVideoData(props: {
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  imageUrl?: string; // Fallback for thumbnail
  contentType?: string | null;
  title?: string;
  isVideo?: boolean;
}): StandardVideoData {
  const {
    videoUrl: rawVideoUrl,
    thumbnailUrl: rawThumbnailUrl,
    imageUrl,
    contentType: rawContentType,
    title = 'Video content',
    isVideo = false,
  } = props;
  
  // Ensure URLs have proper protocol
  const videoUrl = normalizeUrl(rawVideoUrl);
  const thumbnailUrl = normalizeUrl(rawThumbnailUrl) || imageUrl || '';
  const contentType = rawContentType || detectContentType(videoUrl);
  
  // Determine video type
  const isYouTube = !!videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  const isVimeo = !!videoUrl && videoUrl.includes('vimeo.com');
  const isExternalVideo = isYouTube || isVimeo;
  const isDirectVideo = isContentfulVideo(videoUrl, contentType);
  
  return {
    isVideo: isVideo && !!videoUrl,
    videoUrl,
    thumbnailUrl,
    contentType,
    title,
    isDirectVideo,
    isExternalVideo,
    isYouTube,
    isVimeo
  };
}

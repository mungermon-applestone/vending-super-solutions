
import React from 'react';

interface HeroImageProps {
  imageUrl: string;
  imageAlt: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ imageUrl, imageAlt }) => {
  // Log image loading for debugging
  React.useEffect(() => {
    console.log('[HeroImage] Rendering with image:', {
      imageUrl,
      imageAlt,
      hasUrl: !!imageUrl
    });
  }, [imageUrl, imageAlt]);

  // Make sure we have a valid image URL
  const validImageUrl = imageUrl && (
    imageUrl.startsWith('http') || 
    imageUrl.startsWith('//') || 
    imageUrl.startsWith('/')
  );

  // Extract the final image URL, ensuring it has proper protocol
  let finalImageUrl = validImageUrl ? imageUrl : 
    "https://images.unsplash.com/photo-1562184552-997c461abbe6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80";
    
  // Add https: if the URL starts with // (protocol-relative URL)
  if (finalImageUrl.startsWith('//')) {
    finalImageUrl = 'https:' + finalImageUrl;
    console.log('[HeroImage] Added https protocol to URL:', finalImageUrl);
  }

  // Log the final URL we're using
  React.useEffect(() => {
    console.log('[HeroImage] Using final image URL:', finalImageUrl);
  }, [finalImageUrl]);

  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <img 
          src={finalImageUrl}
          alt={imageAlt || "Vending Technology"}
          className="w-full h-auto object-cover"
          onLoad={() => console.log('[HeroImage] Successfully loaded image:', finalImageUrl)}
          onError={(e) => {
            console.error('[HeroImage] Failed to load image:', finalImageUrl);
            e.currentTarget.src = "https://images.unsplash.com/photo-1562184552-997c461abbe6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80";
          }}
        />
      </div>
    </div>
  );
};

export default HeroImage;

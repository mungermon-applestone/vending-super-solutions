
import React from 'react';
import Image from '../common/Image';

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

  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <Image 
          src={finalImageUrl}
          alt={imageAlt || "Vending Technology"}
          className="w-full h-auto object-cover"
          priority={true} // This is a hero image, so it's important to load quickly
          sizes="(min-width: 1280px) 1200px, (min-width: 768px) 768px, 100vw"
          objectFit="cover"
        />
      </div>
    </div>
  );
};

export default HeroImage;

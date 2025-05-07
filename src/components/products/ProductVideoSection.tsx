
import { Play } from 'lucide-react';

interface ProductVideoSectionProps {
  title: string;
  description: string;
  videoId?: string;
  videoUrl?: string;
  thumbnailImage: string;
}

const ProductVideoSection = ({
  title,
  description,
  videoId,
  videoUrl,
  thumbnailImage
}: ProductVideoSectionProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-vending-blue-dark">{title}</h2>
          <p className="subtitle mx-auto">{description}</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {videoId ? (
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Product video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg shadow-lg"
              ></iframe>
            </div>
          ) : videoUrl ? (
            <div className="aspect-w-16 aspect-h-9">
              <video 
                src={videoUrl}
                controls
                poster={thumbnailImage}
                className="w-full h-full rounded-lg shadow-lg object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img 
                src={thumbnailImage} 
                alt="Video thumbnail" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-4 shadow-lg hover:bg-white transition-colors cursor-pointer">
                  <Play className="h-8 w-8 text-vending-blue fill-vending-blue" />
                </div>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-4 text-center">
            See our vending solution in action
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductVideoSection;


import React from 'react';

interface BusinessGoalVideoProps {
  video: {
    url: string;
    title?: string;
  };
  title?: string;
  description?: string;
}

const BusinessGoalVideoSection: React.FC<BusinessGoalVideoProps> = ({
  video,
  title = "See it in action",
  description = "Watch our solution help businesses achieve their goals"
}) => {
  if (!video || !video.url) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 text-vending-blue-dark">{title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>
        </div>
        
        <div className="aspect-video rounded-lg overflow-hidden shadow-xl max-w-4xl mx-auto">
          <video
            src={video.url}
            title={video.title || 'Business goal video'}
            controls
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalVideoSection;

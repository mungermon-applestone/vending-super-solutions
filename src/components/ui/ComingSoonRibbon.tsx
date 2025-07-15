import React from 'react';

const ComingSoonRibbon: React.FC = () => {
  return (
    <div className="absolute bottom-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
      <div className="absolute bottom-0 right-0 w-32 h-8 bg-gradient-to-r from-primary to-primary-glow transform rotate-45 translate-x-6 translate-y-6 shadow-lg">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-xs font-bold transform -rotate-45 whitespace-nowrap">
            COMING SOON
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonRibbon;
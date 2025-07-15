import React from 'react';

const ComingSoonRibbon: React.FC = () => {
  return (
    <div className="absolute bottom-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
      <div className="absolute bottom-0 right-0 w-48 h-16 bg-gradient-to-r from-primary to-primary-glow transform rotate-45 translate-x-8 translate-y-8 shadow-2xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-sm font-bold transform -rotate-45 whitespace-nowrap tracking-wider">
            COMING SOON
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonRibbon;
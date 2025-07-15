import React from 'react';

interface ComingSoonRibbonProps {
  className?: string;
}

const ComingSoonRibbon: React.FC<ComingSoonRibbonProps> = ({ className = '' }) => {
  return (
    <div className={`absolute -bottom-1 -right-1 z-10 ${className}`}>
      <div className="relative">
        {/* Ribbon background */}
        <div 
          className="bg-gradient-to-br from-accent to-accent-foreground text-accent-foreground shadow-lg transform rotate-45 origin-bottom-right"
          style={{
            width: '100px',
            height: '25px',
            transform: 'rotate(45deg) translate(35px, -35px)',
          }}
        >
          {/* Ribbon text */}
          <div 
            className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white"
            style={{
              transform: 'rotate(-45deg)',
            }}
          >
            COMING SOON
          </div>
        </div>
        
        {/* Shadow effect */}
        <div 
          className="absolute bg-black/20 transform rotate-45 origin-bottom-right"
          style={{
            width: '100px',
            height: '25px',
            transform: 'rotate(45deg) translate(37px, -33px)',
            zIndex: -1,
          }}
        />
      </div>
    </div>
  );
};

export default ComingSoonRibbon;
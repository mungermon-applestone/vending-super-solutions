
import React from 'react';

interface WifiProps {
  className?: string;
}

const Wifi: React.FC<WifiProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 20h.01" />
      <path d="M8 16a4 4 0 0 1 8 0" />
      <path d="M4 12a8 8 0 0 1 16 0" />
    </svg>
  );
};

// Export as both default and named export to maintain compatibility
export { Wifi };
export default Wifi;

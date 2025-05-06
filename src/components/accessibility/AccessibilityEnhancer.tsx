
import React, { useEffect, useRef } from 'react';

/**
 * Component to enhance accessibility throughout the application
 * Implements keyboard navigation improvements, focus management,
 * and ARIA attribute handling
 */
const AccessibilityEnhancer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mainRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Skip to main content functionality
    const handleSkipToMain = (e: KeyboardEvent) => {
      // If Tab is pressed at the very beginning of the page
      if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const skipLink = document.getElementById('skip-to-main');
        if (skipLink) {
          skipLink.style.transform = 'translateY(0)';
          skipLink.focus();
          e.preventDefault();
        }
      }
    };
    
    document.addEventListener('keydown', handleSkipToMain);
    
    // Ensure all interactive elements have proper focus styles
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      :focus-visible {
        outline: 2px solid #2563eb !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.removeEventListener('keydown', handleSkipToMain);
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);

  // Function to ensure all images have alt text by checking the DOM
  useEffect(() => {
    const checkImagesForAltText = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.hasAttribute('alt')) {
          console.warn('Image missing alt text:', img);
          // Set empty alt for decorative images (better than nothing)
          img.setAttribute('alt', '');
        }
      });
    };
    
    // Run on initial render and then observe for DOM changes
    checkImagesForAltText();
    
    const observer = new MutationObserver(checkImagesForAltText);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <>
      {/* Skip to main content link */}
      <a 
        id="skip-to-main"
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-600 focus:shadow-md"
      >
        Skip to main content
      </a>
      
      <div ref={mainRef} id="main-content" tabIndex={-1}>
        {children}
      </div>
    </>
  );
};

export default AccessibilityEnhancer;

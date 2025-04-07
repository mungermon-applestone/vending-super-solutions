
import { useEffect } from 'react';

/**
 * Hook that ensures all form inputs remain editable
 * Uses both direct DOM manipulation and a MutationObserver
 */
export const useKeepFormsEditable = () => {
  useEffect(() => {
    console.log('[useKeepFormsEditable] Initializing hook to keep forms editable');
    
    // Function to force all inputs to be editable
    const makeInputsEditable = () => {
      const formElements = document.querySelectorAll('input, textarea, select');
      console.log(`[useKeepFormsEditable] Found ${formElements.length} form elements to make editable`);
      
      formElements.forEach((element, index) => {
        const inputElement = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const wasReadOnly = inputElement.readOnly;
        const wasDisabled = inputElement.disabled;
        
        if (wasReadOnly || wasDisabled) {
          console.log(`[useKeepFormsEditable] Making element ${index} (${inputElement.name || inputElement.id || 'unnamed'}) editable`);
          inputElement.readOnly = false;
          inputElement.disabled = false;
        }
      });
    };
    
    // Run immediately
    makeInputsEditable();
    
    // Set up interval
    const interval = setInterval(makeInputsEditable, 500);
    
    // Set up mutation observer
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'readonly' || mutation.attributeName === 'disabled')) {
          console.log('[useKeepFormsEditable] Detected attribute change that might affect editability');
          makeInputsEditable();
        } else if (mutation.type === 'childList') {
          console.log('[useKeepFormsEditable] Detected DOM structure change, checking for new inputs');
          makeInputsEditable();
        }
      });
    });
    
    // Observe the entire document for changes to readonly/disabled attributes and DOM structure
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['readonly', 'disabled']
    });
    
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);
};

export default useKeepFormsEditable;

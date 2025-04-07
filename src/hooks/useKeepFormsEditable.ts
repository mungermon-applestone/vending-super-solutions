
import { useEffect } from 'react';

/**
 * Hook that ensures all form inputs remain editable
 * Uses both direct DOM manipulation, a MutationObserver,
 * and an interval to repeatedly check and force editability
 */
export const useKeepFormsEditable = () => {
  useEffect(() => {
    console.log('[useKeepFormsEditable] Initializing super aggressive hook to keep forms editable');
    
    // Function to force all inputs to be editable
    const makeInputsEditable = () => {
      const formElements = document.querySelectorAll('input, textarea, select');
      
      if (formElements.length === 0) {
        console.log('[useKeepFormsEditable] No form elements found yet, will try again');
        return false;
      }
      
      console.log(`[useKeepFormsEditable] Found ${formElements.length} form elements to make editable`);
      
      let madeChanges = false;
      
      formElements.forEach((element, index) => {
        // Skip elements that have React event handlers
        if (element.hasAttribute('data-force-skip')) {
          return;
        }
        
        // Handle each element type appropriately
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          // Input and textarea elements have readOnly property
          const wasReadOnly = element.readOnly;
          const wasDisabled = element.disabled;
          
          if (wasReadOnly || wasDisabled) {
            console.log(`[useKeepFormsEditable] Making ${element.tagName.toLowerCase()} ${index} (${element.name || element.id || 'unnamed'}) editable`);
            element.readOnly = false;
            element.disabled = false;
            
            // Force enable the DOM element
            element.setAttribute('readonly', 'false');
            element.removeAttribute('disabled');
            element.setAttribute('data-forced-editable', 'true');
            
            // Try to dispatch an event to notify React of the change
            element.dispatchEvent(new Event('input', { bubbles: true }));
            
            madeChanges = true;
          }
        } else if (element instanceof HTMLSelectElement) {
          // Select elements only have disabled property
          const wasDisabled = element.disabled;
          
          if (wasDisabled) {
            console.log(`[useKeepFormsEditable] Making select ${index} (${element.name || element.id || 'unnamed'}) editable`);
            element.disabled = false;
            
            // Force enable the DOM element
            element.removeAttribute('disabled');
            element.setAttribute('data-forced-editable', 'true');
            
            // Try to dispatch an event to notify React
            element.dispatchEvent(new Event('change', { bubbles: true }));
            
            madeChanges = true;
          }
        }
      });
      
      return madeChanges;
    };
    
    // Track if we need more aggressive methods
    let attemptCount = 0;
    const maxAttempts = 10;
    
    // Run immediately
    const initialChanges = makeInputsEditable();
    
    if (initialChanges) {
      console.log('[useKeepFormsEditable] Initial changes made, forms should be editable');
    }
    
    // Set up interval with increasing frequency if needed
    const interval = setInterval(() => {
      const madeChanges = makeInputsEditable();
      attemptCount++;
      
      if (madeChanges) {
        console.log(`[useKeepFormsEditable] Made changes on attempt ${attemptCount}`);
      }
      
      // If we've made many attempts, try more aggressive methods
      if (attemptCount >= maxAttempts) {
        console.log('[useKeepFormsEditable] Max attempts reached, using more aggressive methods');
        
        // Very aggressive approach - modify React internal props if possible
        document.querySelectorAll('input, textarea, select').forEach(el => {
          // Try to bypass React's control by forcing the element to be editable
          el.removeAttribute('readonly');
          el.removeAttribute('disabled');
          el.setAttribute('data-forced-editable', 'true');
          
          // For React-controlled inputs, try to make their props mutable
          const reactKey = Object.keys(el).find(key => key.startsWith('__reactProps$'));
          if (reactKey && (el as any)[reactKey]) {
            try {
              const props = (el as any)[reactKey];
              // Force props to be editable
              if (props.readOnly === true) props.readOnly = false;
              if (props.disabled === true) props.disabled = false;
              console.log('[useKeepFormsEditable] Modified React props directly for', el);
            } catch (err) {
              console.error('[useKeepFormsEditable] Failed to modify React props:', err);
            }
          }
        });
      }
    }, 500);
    
    // Set up mutation observer
    const observer = new MutationObserver((mutations) => {
      let shouldMakeEditable = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'readonly' || mutation.attributeName === 'disabled')) {
          console.log('[useKeepFormsEditable] Detected attribute change that might affect editability');
          shouldMakeEditable = true;
        } else if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any added nodes are form elements or contain form elements
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.tagName === 'SELECT') {
                shouldMakeEditable = true;
              } else if (node.querySelectorAll('input, textarea, select').length > 0) {
                shouldMakeEditable = true;
              }
            }
          });
        }
      });
      
      if (shouldMakeEditable) {
        console.log('[useKeepFormsEditable] DOM changes detected that require making inputs editable');
        makeInputsEditable();
      }
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

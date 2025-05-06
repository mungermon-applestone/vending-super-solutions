
import { init } from 'emailjs-com';

// Initialize EmailJS with your user ID / public key
export const initEmailJS = () => {
  // Your EmailJS User ID / Public Key is already set
  init('GF7ahmvXoDxVofUpa');
  
  // Log initialization success
  console.log('EmailJS initialized successfully with public key');
};

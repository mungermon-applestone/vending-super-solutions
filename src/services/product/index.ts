
import { createProduct } from './createProduct';
import { updateProduct } from './updateProduct';
import { 
  processBenefits,
  addProductImage, 
  addProductBenefits, 
  addProductFeatures,
  updateProductImage, 
  updateProductBenefits, 
  updateProductFeatures,
  checkProductSlugExists
} from './productHelpers';

export { 
  // Main operations
  createProduct,
  updateProduct,
  
  // Helper functions
  processBenefits,
  addProductImage,
  addProductBenefits,
  addProductFeatures,
  updateProductImage,
  updateProductBenefits,
  updateProductFeatures,
  checkProductSlugExists
};

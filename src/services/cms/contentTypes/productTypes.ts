
// This file is now just a re-export of the modularized product types files
import { productTypeOperations } from './productTypes/index';
import {
  fetchProductTypes,
  fetchProductTypeBySlug,
  fetchProductTypeByUUID,
  createProductType,
  updateProductType,
  deleteProductType
} from './productTypes/index';

export {
  productTypeOperations,
  fetchProductTypes,
  fetchProductTypeBySlug,
  fetchProductTypeByUUID,
  createProductType,
  updateProductType,
  deleteProductType
};

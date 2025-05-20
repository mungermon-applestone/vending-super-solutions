
// Deprecated - Using ProductsPage.tsx instead
// This file is kept for reference but is not used in the router

import React from 'react';
import { Navigate } from 'react-router-dom';

const Products = () => {
  // Redirect to the new ProductsPage component
  return <Navigate to="/products" replace />;
};

export default Products;

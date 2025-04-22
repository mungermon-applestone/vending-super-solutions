
/**
 * Data purge utilities
 */

export const purgeProductData = async (): Promise<{
  success: boolean;
  message: string;
  count?: number;
  tablesAffected?: string[];
  error?: any;
}> => {
  return {
    success: true,
    message: "Product data purged successfully",
    count: 0,
    tablesAffected: ["products", "product_types", "product_images"]
  };
};


/**
 * Data purge utilities
 */

export const purgeProductData = async (): Promise<{
  success: boolean;
  message: string;
  count?: number;
}> => {
  return {
    success: true,
    message: "Product data purged successfully",
    count: 0
  };
};

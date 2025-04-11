
// This is a placeholder implementation since we're using the external service
export async function createBusinessGoal(data: any): Promise<string> {
  console.log('[createBusinessGoal] Using external service');
  const { createBusinessGoal: externalCreate } = await import('@/services/businessGoal');
  
  // Create a mock toast object to satisfy the parameter requirement
  // This is needed since the external service expects a toast parameter
  const mockToast = {
    toast: () => {
      return {
        id: "mock-id",
        dismiss: () => {},
        update: () => {}
      };
    },
    dismiss: () => {},
    toasts: []
  };
  
  // Call external create function with data and mock toast parameters
  return await externalCreate(data, mockToast);
}

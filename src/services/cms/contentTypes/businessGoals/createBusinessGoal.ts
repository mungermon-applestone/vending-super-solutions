
// This is a placeholder implementation since we're using the external service
export async function createBusinessGoal(data: any): Promise<string> {
  console.log('[createBusinessGoal] Using external service');
  const { createBusinessGoal: externalCreate } = await import('@/services/businessGoal');
  
  // Call external create function with data parameter only
  return await externalCreate(data);
}


// This is a placeholder implementation since we're using the external service
export async function updateBusinessGoal(id: string, data: any): Promise<boolean> {
  console.log('[updateBusinessGoal] Using external service');
  const { updateBusinessGoal: externalUpdate } = await import('@/services/businessGoal');
  
  // Remove toast parameter to fix type issues
  return await externalUpdate(id, data);
}


// This is a placeholder implementation since we're using the external service
export async function deleteBusinessGoal(id: string): Promise<boolean> {
  console.log('[deleteBusinessGoal] Using external service');
  const { deleteBusinessGoal: externalDelete } = await import('@/services/businessGoal');
  return await externalDelete(id);
}

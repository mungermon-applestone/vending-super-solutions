
// Re-export technology services for easier imports
export { deleteTechnology } from './contentTypes/technologies/deleteTechnology';
export { cloneTechnology } from './contentTypes/technologies/cloneTechnology';
export { fetchTechnologies, fetchTechnologiesSafe } from './contentTypes/technologies/fetchTechnologies';
export { fetchTechnologyBySlug, getTechnologyBySlug } from './contentTypes/technologies/fetchTechnologyBySlug';

// Import fetchTechnologies function for use in the connection test
import { fetchTechnologies } from './contentTypes/technologies/fetchTechnologies';

// Export a simple function to test the connection
export async function testStrapiConnection() {
  try {
    const technologies = await fetchTechnologies();
    return {
      success: true,
      message: `Successfully connected to Strapi and found ${technologies.length} technologies`,
      data: technologies
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to Strapi: ${error instanceof Error ? error.message : String(error)}`,
      error
    };
  }
}

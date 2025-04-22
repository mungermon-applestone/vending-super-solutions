
import { LandingPage } from "@/types/landingPage";
import { fetchLandingPages } from "./contentTypes/landingPages";

export const initMockLandingPagesData = async (): Promise<LandingPage[]> => {
  const existingPages = await fetchLandingPages();
  
  if (existingPages.length > 0) {
    console.log('[initMockLandingPagesData] Using existing landing pages data');
    return existingPages;
  }
  
  console.log('[initMockLandingPagesData] Creating mock landing pages data');
  
  // Return empty array for now
  return [];
};

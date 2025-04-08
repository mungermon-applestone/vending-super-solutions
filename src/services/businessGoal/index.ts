
import { createBusinessGoal } from './createBusinessGoal';
import { updateBusinessGoal } from './updateBusinessGoal';
import { 
  processBenefits,
  addBusinessGoalImage, 
  addBusinessGoalBenefits, 
  addBusinessGoalFeatures,
  updateBusinessGoalImage, 
  updateBusinessGoalBenefits, 
  updateBusinessGoalFeatures,
  checkBusinessGoalSlugExists
} from './businessGoalHelpers';

export { 
  // Main operations
  createBusinessGoal,
  updateBusinessGoal,
  
  // Helper functions
  processBenefits,
  addBusinessGoalImage,
  addBusinessGoalBenefits,
  addBusinessGoalFeatures,
  updateBusinessGoalImage,
  updateBusinessGoalBenefits,
  updateBusinessGoalFeatures,
  checkBusinessGoalSlugExists
};

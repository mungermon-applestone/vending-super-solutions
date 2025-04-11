
// This file is now just a re-export of the modularized business goals files
import { businessGoalOperations } from './businessGoals/index';
import {
  fetchBusinessGoals,
  fetchBusinessGoalBySlug,
  createBusinessGoal,
  updateBusinessGoal,
  deleteBusinessGoal,
  cloneBusinessGoal
} from './businessGoals/index';

export {
  businessGoalOperations,
  fetchBusinessGoals,
  fetchBusinessGoalBySlug,
  createBusinessGoal,
  updateBusinessGoal,
  deleteBusinessGoal,
  cloneBusinessGoal
};

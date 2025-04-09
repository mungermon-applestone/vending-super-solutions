
// Re-export all machine-related functionality from the modular files
import {
  fetchMachines,
  fetchMachineById,
  createMachine,
  updateMachine,
  deleteMachine
} from './machines/index';

export {
  fetchMachines,
  fetchMachineById,
  createMachine,
  updateMachine,
  deleteMachine
};

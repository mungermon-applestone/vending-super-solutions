
import { fetchMachines, fetchMachineById } from './api';
import { createMachine } from './create';
import { updateMachine } from './update';
import { deleteMachine } from './delete';

// Export all functions from this central file
export {
  fetchMachines,
  fetchMachineById,
  createMachine,
  updateMachine,
  deleteMachine
};


import { fetchMachines, fetchMachineBySlug, fetchMachineById } from './api';
import { createMachine } from './create';
import { updateMachine } from './update';
import { deleteMachine } from './delete';
import { cloneMachine } from './cloneMachine';

export {
  fetchMachines,
  fetchMachineById,
  fetchMachineBySlug,
  createMachine,
  updateMachine,
  deleteMachine,
  cloneMachine
};

// Export machine operations
export const machineOperations = {
  fetchAll: fetchMachines,
  fetchById: fetchMachineById,
  fetchBySlug: fetchMachineBySlug,
  create: createMachine,
  update: updateMachine,
  delete: deleteMachine,
  clone: cloneMachine
};

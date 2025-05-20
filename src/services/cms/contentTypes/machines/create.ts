
import { CMSMachine } from '@/types/cms';
import { throwDeprecatedOperationError } from '../../utils/deprecationToastUtils';

/**
 * Create a new machine in the CMS
 * @deprecated This method is deprecated and will be removed in future versions.
 * Please use Contentful directly for machine content management.
 */
export async function createMachine(data: Partial<CMSMachine>): Promise<CMSMachine | null> {
  throwDeprecatedOperationError("createMachine");
  return null;
}

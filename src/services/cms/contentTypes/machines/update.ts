
import { CMSMachine } from '@/types/cms';
import { throwDeprecatedOperationError } from '../../utils/deprecationToastUtils';

/**
 * Update an existing machine in the CMS
 * @deprecated This method is deprecated and will be removed in future versions.
 * Please use Contentful directly for machine content management.
 */
export async function updateMachine(id: string, data: Partial<CMSMachine>): Promise<CMSMachine | null> {
  throwDeprecatedOperationError("updateMachine");
  return null;
}

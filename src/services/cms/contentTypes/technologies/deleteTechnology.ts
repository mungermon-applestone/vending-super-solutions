
import { throwDeprecatedOperationError } from '../../utils/deprecationToastUtils';

/**
 * Delete a technology from the CMS
 * @deprecated This method is deprecated and will be removed in future versions.
 * Please use Contentful directly for technology content management.
 */
export async function deleteTechnology(id: string): Promise<boolean> {
  throwDeprecatedOperationError("deleteTechnology");
  return false;
}

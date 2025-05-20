
import { CMSTechnology } from '@/types/cms';
import { throwDeprecatedOperationError } from '../../utils/deprecationToastUtils';

/**
 * Clone a technology in the CMS
 * @deprecated This method is deprecated and will be removed in future versions.
 * Please use Contentful directly for technology content management.
 */
export async function cloneTechnology(id: string): Promise<CMSTechnology | null> {
  throwDeprecatedOperationError("cloneTechnology");
  return null;
}

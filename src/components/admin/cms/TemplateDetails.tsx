
import React from 'react';
import { ContentTypeTemplate, AVAILABLE_ICONS } from '@/types/contentful-admin';

interface TemplateDetailsProps {
  template: ContentTypeTemplate;
}

export const TemplateDetails: React.FC<TemplateDetailsProps> = ({ template }) => {
  // Helper function to check if a field has a dropdown (in validation)
  const hasDropdownOptions = (field: any) => {
    return field.validations?.some((v: any) => v.in && Array.isArray(v.in));
  };

  // Get dropdown options for a field
  const getDropdownOptions = (field: any) => {
    const validation = field.validations?.find((v: any) => v.in && Array.isArray(v.in));
    return validation?.in || [];
  };

  // Check if the field is for icons
  const isIconField = (fieldId: string, fieldValidations: any[]) => {
    if (fieldId === 'icon') {
      const iconValues = AVAILABLE_ICONS.map(icon => icon.value);
      const hasIconValidation = fieldValidations?.some(
        v => v.in && v.in.some((value: string) => iconValues.includes(value))
      );
      return hasIconValidation;
    }
    return false;
  };

  return (
    <div className="border rounded-md p-3 bg-muted/30">
      <h4 className="font-medium mb-2 text-sm">
        Template Details: {template.name}
      </h4>
      <div className="text-xs space-y-1 text-muted-foreground">
        <p><strong>ID:</strong> {template.contentType.id}</p>
        <p><strong>Display Field:</strong> {template.contentType.displayField}</p>
        <p><strong>Fields:</strong> {template.contentType.fields.length}</p>
        <details>
          <summary className="cursor-pointer hover:text-foreground">View Fields</summary>
          <ul className="ml-2 mt-1 space-y-1">
            {template.contentType.fields.map((field) => (
              <li key={field.id}>
                <strong>{field.name}</strong> ({field.type})
                {field.required && <span className="text-red-500">*</span>}
                
                {hasDropdownOptions(field) && (
                  <div className="ml-3 mt-1 text-xs text-muted-foreground">
                    <span>Options: </span>
                    {isIconField(field.id, field.validations || []) ? (
                      <span className="italic">Icons selection available</span>
                    ) : (
                      <span className="italic">{getDropdownOptions(field).join(', ')}</span>
                    )}
                  </div>
                )}
                
                {field.id === 'dimensions' || 
                 field.id === 'weight' || 
                 field.id === 'powerRequirements' || 
                 field.id === 'capacity' || 
                 field.id === 'paymentOptions' || 
                 field.id === 'connectivity' || 
                 field.id === 'manufacturer' || 
                 field.id === 'warranty' && (
                  <div className="ml-3 text-xs text-blue-400">
                    <span>Machine specification field</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
};

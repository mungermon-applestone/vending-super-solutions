
import React from 'react';
import { ContentTypeTemplate } from '@/types/contentful-admin';

interface TemplateDetailsProps {
  template: ContentTypeTemplate;
}

export const TemplateDetails: React.FC<TemplateDetailsProps> = ({ template }) => {
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
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
};

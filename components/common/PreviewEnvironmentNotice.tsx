
import React from 'react';

export default function PreviewEnvironmentNotice() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 p-2 text-center text-amber-800 text-sm">
      <p>
        <strong>Preview Environment</strong> - Content changes made in Contentful may be visible here 
        before they are published to production.
      </p>
    </div>
  );
}

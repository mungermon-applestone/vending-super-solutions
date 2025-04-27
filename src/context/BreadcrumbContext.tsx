
import React, { createContext, useContext, ReactNode } from 'react';

export interface Breadcrumb {
  name: string;
  url: string;
  position: number;
}

interface BreadcrumbContextType {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  getSchemaFormattedBreadcrumbs: () => Breadcrumb[];
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [breadcrumbs, setBreadcrumbs] = React.useState<Breadcrumb[]>([]);

  const getSchemaFormattedBreadcrumbs = () => {
    return breadcrumbs.map(crumb => ({
      name: crumb.name,
      url: `https://yourdomain.com${crumb.url}`,
      position: crumb.position
    }));
  };

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs, getSchemaFormattedBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
  }
  return context;
};

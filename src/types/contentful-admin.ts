
// Basic interface definitions for contentful-admin
export interface ContentTypeTemplate {
  id: string;
  name: string;
  description: string;
  contentType: {
    id: string;
    name: string;
    description: string;
    displayField: string;
    publish: boolean;
    fields: Array<{
      id: string;
      name: string;
      type: string;
      required?: boolean;
      localized?: boolean;
      linkType?: string;
      validations?: Array<any>;
      items?: any;
    }>;
  };
}

export const AVAILABLE_ICONS = [
  { label: "None", value: "none" },
  { label: "Zap", value: "Zap" },
  { label: "Box", value: "Box" },
  { label: "Cloud", value: "Cloud" },
  { label: "Clock", value: "Clock" },
  { label: "Network", value: "Network" },
  { label: "UploadCloud", value: "UploadCloud" },
  { label: "ArrowDownToLine", value: "ArrowDownToLine" },
  { label: "ShieldCheck", value: "ShieldCheck" },
  { label: "CreditCard", value: "CreditCard" },
  { label: "Database", value: "Database" },
  { label: "Users", value: "Users" },
  { label: "Mail", value: "Mail" },
  { label: "Layers", value: "Layers" },
  { label: "BarChartBig", value: "BarChartBig" },
  { label: "Wifi", value: "Wifi" },
  { label: "Settings", value: "Settings" }
];

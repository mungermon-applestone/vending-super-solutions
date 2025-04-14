
import { ContentTypeProps } from '@/services/cms/types/contentfulTypes';

export interface ContentTypeTemplate {
  id: string;
  name: string;
  description: string;
  contentType: ContentTypeProps;
}

export interface ContentTypeCreatorResult {
  success?: boolean;
  message?: string;
  contentTypeId?: string;
}

export interface IconOption {
  name: string;
  value: string;
}

export const AVAILABLE_ICONS: IconOption[] = [
  { name: "Check", value: "check" },
  { name: "Shield", value: "shield" },
  { name: "Server", value: "server" },
  { name: "Settings", value: "settings" },
  { name: "Bell", value: "bell" },
  { name: "Battery", value: "battery" },
  { name: "ClipboardCheck", value: "clipboard-check" },
  { name: "RefreshCcw", value: "refresh-ccw" },
  { name: "TrendingUp", value: "trending-up" },
  { name: "PieChart", value: "pie-chart" },
  { name: "Map", value: "map" },
  { name: "UserCheck", value: "user-check" }
];

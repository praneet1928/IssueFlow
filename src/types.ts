// src/types.ts
export interface IssueTag {
  id: string;
  label: string;
}

export interface IssueItem {
  id: string;
  code: string; // e.g., "#AD677"
  priority: string;
  timestampMinutesAgo: number;
  title: string;
  location: string;
  categoryTags: IssueTag[];
  Device: string;
}

export interface DeviceItem {
  id: string;
  name: string;
  serialNumber: string;
  imageUrl?: string;
  inWarranty: boolean;
}

export interface HomeScreenProps {
  userName?: string;
  issues?: IssueItem[];
  devices?: DeviceItem[];
  isLoading?: boolean;
  error?: string | null;
  onRequestNewDevice?: () => void;
  onOpenNotifications?: () => void;
  onFabPress?: () => void;
}
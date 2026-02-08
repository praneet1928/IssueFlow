// src/types.ts
export interface IssueTag {
  id: string;
  label: string;
}

export type IssueItem = {
  id: string;
  code: string;
  title: string;
  priority: "critical" | "moderate" | "low";
  location: string;

  categoryTags: { id: string; label: string }[];
  Device: string;

  // ⬇️ BACKEND / LIFECYCLE FIELDS (OPTIONAL)
  createdAt?: string;
  status?: "in progress" | "in review" | "completed";
  assignedTo?: string;

  // ⬇️ OPTIONAL CONTENT
  description?: string;
  images?: string[];

  // ⬇️ CLIENT-ONLY
  timestampMinutesAgo?: number;
};



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
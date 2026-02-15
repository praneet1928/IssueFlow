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
  status?: "not started" | "assigned" | "in progress" | "completed";
  assignedTo?: string;
assignedAt?: string;
completedAt?: string;
  // ⬇️ OPTIONAL CONTENT
  description?: string;
  images?: string[];
 comments?: TicketComment[];
  // ⬇️ CLIENT-ONLY
  timestampMinutesAgo?: number;
};

export interface TicketComment {
  id: string;
  text: string;
  createdAt: string;
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
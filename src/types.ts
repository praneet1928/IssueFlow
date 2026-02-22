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
  createdAt: string;
  status?: "not started" | "assigned" | "in progress" | "completed" | "discarded";
  assignedTo?: string;
assignedAt?: string;
completedAt?: string;
 discardedAt?: string; 
  // ⬇️ OPTIONAL CONTENT
  description?: string;
  images?: string[];
 comments?: TicketComment[];
  // ⬇️ CLIENT-ONLY
  timestampMinutesAgo?: number;
};

export interface TicketComment {
  id: string
  text?: string
  images: string[]
  createdAt: string
}

// types/notification.ts

export type NotificationType =
  | "issue_created"
  | "assigned"
  | "unassigned"
  | "resolved"
  | "comment";

export interface AppNotification {
  id: string;
  type: NotificationType;
  issueId: string;
  issueCode: string;
  message?: string;
  createdAt: string;
  read?: boolean;
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
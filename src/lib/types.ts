export enum Role {
  MASTER_ADMIN = 'Master Admin',
  ADMIN = 'Admin',
  PROPERTY_MANAGER = 'Property Manager',
  SUPERVISOR = 'Supervisor',
  TECHNICIAN = 'Technician',
  OWNER = 'Owner',
  VENDOR = 'Vendor',
}

export enum Status {
  NEW = 'New',
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed',
  CLOSED = 'Closed',
}

export interface User {
  id: number;
  name: string;
  role: Role;
  avatarUrl: string;
}

export interface Property {
  id: number;
  name: string;
  address: string;
}

export interface Media {
  id: number;
  url: string;
  type: 'image' | 'video';
  uploadedBy: number;
  timestamp: string;
}

export enum ActivityType {
  CREATED = 'CREATED',
  NOTE = 'NOTE',
  STATUS_CHANGE = 'STATUS_CHANGE',
  ASSIGNMENT = 'ASSIGNMENT',
  MEDIA_UPLOAD = 'MEDIA_UPLOAD',
}

export interface Activity {
  id: number;
  userId: number;
  type: ActivityType;
  timestamp: string;
  details: {
    content?: string; // For notes
    oldStatus?: Status;
    newStatus?: Status;
    assignedToId?: number;
    mediaUrl?: string;
  };
}

export interface WorkOrder {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: 'Low' | 'Medium' | 'High';
  propertyId: number;
  unitNumber?: string;
  tenant?: {
    name: string;
    phone: string;
    email: string;
  };
  assignedToId?: number;
  vendorId?: number;
  media: Media[];
  tags?: string[];
  activity: Activity[];
}

export type View = 'DASHBOARD' | 'WORK_ORDERS' | 'DETAIL' | 'SETTINGS' | 'CREATE_WO';
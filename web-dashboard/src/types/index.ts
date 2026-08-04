export type UserRole = 'VICTIM' | 'SOCIAL_WORKER' | 'ORGANIZATION' | 'ADMIN';
export type CaseStatus = 'New' | 'Under Investigation' | 'Support Provided' | 'Resolved' | 'Closed';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  status?: 'Active' | 'Inactive';
  createdAt?: string;
  avatar?: string;
}

export interface Incident {
  id: string;
  type: string;
  location: string;
  date: string;
  status: CaseStatus;
  riskLevel?: RiskLevel;
  assignedTo: string;
  description?: string;
  isAnonymous?: boolean;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  status: CaseStatus;
  priority: RiskLevel;
  victimName: string;
  victimAge?: number;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  location: string;
  incidentType: string;
  description?: string;
  notes?: string[];
}

export interface Victim {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  emergencyContact: string;
  casesCount: number;
  registeredDate: string;
  isAnonymous: boolean;
}

export interface SocialWorker {
  id: string;
  name: string;
  department: string;
  specialization: string;
  location: string;
  phone: string;
  email: string;
  activeCases: number;
  resolvedCases: number;
  availability: 'Available' | 'Busy' | 'On Leave';
}

export interface Organization {
  id: string;
  name: string;
  type: 'Hospital' | 'Police' | 'Shelter' | 'NGO' | 'Legal Aid';
  location: string;
  phone: string;
  email: string;
  servicesCount: number;
  isVerified: boolean;
  activeAppointments: number;
}

export interface Appointment {
  id: string;
  victimName: string;
  organizationName: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  type: string;
}

export interface MessageThread {
  id: string;
  senderName: string;
  senderRole: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  threadId: string;
  senderName: string;
  isSender: boolean;
  content: string;
  timestamp: string;
}

export type Role = 'VICTIM' | 'SOCIAL_WORKER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  victimProfile?: {
    id: string;
  };
  socialWorkerProfile?: {
    id: string;
  };
}

export interface Case {
  id: string;
  caseId: string;
  type: string;
  status: 'New' | 'In Progress' | 'Resolved';
  date: string;
  location: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  victimId: string;
  assignedTo?: string;
}

export interface Appointment {
  id: string;
  caseId: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  type: string;
}

export interface Service {
  id: string;
  name: string;
  type: string;
  distance: string;
  address: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

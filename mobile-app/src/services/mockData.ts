import { Case, Appointment, Service } from '../types';

export const mockCases: Case[] = [
  { id: '1', caseId: 'SPC-2026-00001', type: 'Domestic Violence', status: 'In Progress', date: '2026-08-01', location: 'Yaoundé', description: 'Assault', riskLevel: 'High', victimId: '1' }
];

export const mockAppointments: Appointment[] = [
  { id: '1', caseId: '1', date: '2026-08-05T10:00:00Z', status: 'Confirmed', type: 'Counseling' }
];

export const mockServices: Service[] = [
  { id: '1', name: 'Safe Haven Shelter', type: 'Shelter', distance: '2.5 km', address: 'Downtown Yaoundé' }
];

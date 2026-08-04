import { Incident, Case, User, Victim, SocialWorker, Organization, Appointment, MessageThread, Message } from '../types';

export const mockUsers: User[] = [
  { id: 'USR-001', name: 'Dr. Aline Ndey', email: 'aline.ndey@safeprotect.cm', role: 'ADMIN', phone: '+237 670 123 456', status: 'Active', createdAt: '2024-01-10' },
  { id: 'USR-002', name: 'Eric Tchana', email: 'eric.tchana@safeprotect.cm', role: 'SOCIAL_WORKER', phone: '+237 699 234 567', status: 'Active', createdAt: '2024-02-15' },
  { id: 'USR-003', name: 'Central Hospital Yaoundé', email: 'contact@ch-yaounde.cm', role: 'ORGANIZATION', phone: '+237 222 345 678', status: 'Active', createdAt: '2024-01-20' },
  { id: 'USR-004', name: 'Marie Dupont', email: 'marie.dupont@gmail.com', role: 'VICTIM', phone: '+237 677 345 890', status: 'Active', createdAt: '2024-04-05' },
  { id: 'USR-005', name: 'Mfoundi Police Station', email: 'police.mfoundi@gov.cm', role: 'ORGANIZATION', phone: '+237 222 117 117', status: 'Active', createdAt: '2024-01-05' },
];

export const mockIncidents: Incident[] = [
  {
    id: 'INC-2024-125',
    type: 'Sexual Abuse',
    location: 'Yaoundé, Mfoundi',
    date: '31 May 2024',
    status: 'New',
    riskLevel: 'Critical',
    assignedTo: 'Unassigned',
    description: 'Urgent assistance requested for minor victim in Mfoundi district.',
    isAnonymous: true
  },
  {
    id: 'INC-2024-124',
    type: 'Domestic Violence',
    location: 'Douala, Bonamoussadi',
    date: '30 May 2024',
    status: 'Under Investigation',
    riskLevel: 'High',
    assignedTo: 'A. Ndey',
    description: 'Physical violence reported by neighbor against mother and child.',
    isAnonymous: false
  },
  {
    id: 'INC-2024-123',
    type: 'Neglect',
    location: 'Bamenda, Mezam',
    date: '29 May 2024',
    status: 'Under Investigation',
    riskLevel: 'Medium',
    assignedTo: 'E. Tchana',
    description: 'Two school-age children left unsupervised for extended periods.',
    isAnonymous: true
  },
  {
    id: 'INC-2024-122',
    type: 'Physical Abuse',
    location: 'Bafoussam, Mifi',
    date: '28 May 2024',
    status: 'New',
    riskLevel: 'High',
    assignedTo: 'Unassigned',
    description: 'Severe physical marks reported on primary school pupil.',
    isAnonymous: false
  },
  {
    id: 'INC-2024-121',
    type: 'Emotional Abuse',
    location: 'Garoua, Bénoué',
    date: '25 May 2024',
    status: 'Support Provided',
    riskLevel: 'Medium',
    assignedTo: 'A. Ndey',
    description: 'Counseling support initiated for traumatized minor.',
    isAnonymous: false
  },
  {
    id: 'INC-2024-120',
    type: 'Domestic Violence',
    location: 'Buea, Fako',
    date: '20 May 2024',
    status: 'Resolved',
    riskLevel: 'High',
    assignedTo: 'E. Tchana',
    description: 'Emergency shelter accommodation provided.',
    isAnonymous: false
  }
];

export const mockCases: Case[] = [
  {
    id: 'CASE-2024-078',
    caseNumber: 'SPC-2024-00078',
    title: 'Sexual Abuse Protection & Medical Referral',
    status: 'Under Investigation',
    priority: 'Critical',
    victimName: 'Anonymous (Female, 13)',
    victimAge: 13,
    assignedTo: 'Aline Ndey (Social Worker)',
    createdAt: '31 May 2024, 10:30 AM',
    updatedAt: '01 June 2024, 02:15 PM',
    location: 'Yaoundé, Mfoundi',
    incidentType: 'Sexual Abuse',
    description: 'Initial assessment completed. Patient referred for medical examination at Central Hospital Yaoundé and trauma counseling.',
    notes: [
      '31 May 2024: Incident reported anonymously via mobile app.',
      '31 May 2024: Case assigned to Aline Ndey for immediate response.',
      '01 Jun 2024: Medical examination scheduled at Central Hospital Yaoundé.'
    ]
  },
  {
    id: 'CASE-2024-077',
    caseNumber: 'SPC-2024-00077',
    title: 'Domestic Violence Intervention & Legal Assistance',
    status: 'Under Investigation',
    priority: 'High',
    victimName: 'Marie Dupont',
    victimAge: 28,
    assignedTo: 'Eric Tchana (Social Worker)',
    createdAt: '30 May 2024, 04:15 PM',
    updatedAt: '31 May 2024, 09:00 AM',
    location: 'Douala, Bonamoussadi',
    incidentType: 'Domestic Violence',
    description: 'Protective order requested. Temporary shelter provided at Safe Shelter Yaoundé.',
    notes: [
      '30 May 2024: Neighbor reported emergency domestic violence event.',
      '31 May 2024: Women Legal Aid Center contacted for legal support.'
    ]
  },
  {
    id: 'CASE-2024-076',
    caseNumber: 'SPC-2024-00076',
    title: 'Child Neglect & Welfare Intervention',
    status: 'Support Provided',
    priority: 'Medium',
    victimName: 'Emmanuel K. & Sibling',
    victimAge: 9,
    assignedTo: 'Aline Ndey (Social Worker)',
    createdAt: '29 May 2024, 11:00 AM',
    updatedAt: '30 May 2024, 03:30 PM',
    location: 'Bamenda, Mezam',
    incidentType: 'Neglect',
    description: 'Food aid and temporary guardian placement verified by social services.',
    notes: [
      '29 May 2024: School teacher flagged prolonged student absence.',
      '30 May 2024: Welfare package delivered.'
    ]
  }
];

export const mockVictims: Victim[] = [
  {
    id: 'VIC-001',
    name: 'Anonymous',
    age: 13,
    gender: 'Female',
    location: 'Yaoundé, Mfoundi',
    emergencyContact: 'Hidden (Protected)',
    casesCount: 1,
    registeredDate: '31 May 2024',
    isAnonymous: true
  },
  {
    id: 'VIC-002',
    name: 'Marie Dupont',
    age: 28,
    gender: 'Female',
    location: 'Douala, Bonamoussadi',
    emergencyContact: '+237 677 345 890',
    casesCount: 1,
    registeredDate: '30 May 2024',
    isAnonymous: false
  },
  {
    id: 'VIC-003',
    name: 'Emmanuel K.',
    age: 9,
    gender: 'Male',
    location: 'Bamenda, Mezam',
    emergencyContact: '+237 699 887 766',
    casesCount: 1,
    registeredDate: '29 May 2024',
    isAnonymous: false
  }
];

export const mockSocialWorkers: SocialWorker[] = [
  {
    id: 'SW-001',
    name: 'Aline Ndey',
    department: 'Child Protection Unit',
    specialization: 'Sexual Trauma & Child Abuse',
    location: 'Yaoundé, Centre',
    phone: '+237 670 123 456',
    email: 'aline.ndey@safeprotect.cm',
    activeCases: 14,
    resolvedCases: 42,
    availability: 'Available'
  },
  {
    id: 'SW-002',
    name: 'Eric Tchana',
    department: 'GBV Response Team',
    specialization: 'Domestic Violence & Legal Aid',
    location: 'Douala, Littoral',
    phone: '+237 699 234 567',
    email: 'eric.tchana@safeprotect.cm',
    activeCases: 11,
    resolvedCases: 38,
    availability: 'Busy'
  },
  {
    id: 'SW-003',
    name: 'Beatrice Bella',
    department: 'Psychosocial Support',
    specialization: 'Trauma Counseling',
    location: 'Bafoussam, Ouest',
    phone: '+237 675 345 678',
    email: 'beatrice.bella@safeprotect.cm',
    activeCases: 8,
    resolvedCases: 29,
    availability: 'Available'
  }
];

export const mockOrganizations: Organization[] = [
  {
    id: 'ORG-001',
    name: 'Central Hospital Yaoundé',
    type: 'Hospital',
    location: 'Yaoundé, Centre (2.3 km)',
    phone: '+237 222 234 111',
    email: 'medical@ch-yaounde.cm',
    servicesCount: 4,
    isVerified: true,
    activeAppointments: 18
  },
  {
    id: 'ORG-002',
    name: 'Mfoundi Police Station',
    type: 'Police',
    location: 'Yaoundé, Mfoundi (1.8 km)',
    phone: '+237 222 117 117',
    email: 'protection@police.mfoundi.gov.cm',
    servicesCount: 2,
    isVerified: true,
    activeAppointments: 6
  },
  {
    id: 'ORG-003',
    name: 'Safe Shelter Yaoundé',
    type: 'Shelter',
    location: 'Yaoundé, Bastos (4.2 km)',
    phone: '+237 671 990 011',
    email: 'help@safeshelter.cm',
    servicesCount: 3,
    isVerified: true,
    activeAppointments: 9
  },
  {
    id: 'ORG-004',
    name: "Women's Legal Aid Center",
    type: 'Legal Aid',
    location: 'Douala, Akwa (3.5 km)',
    phone: '+237 690 445 566',
    email: 'contact@womenslegalaid.cm',
    servicesCount: 3,
    isVerified: true,
    activeAppointments: 12
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'APT-001',
    victimName: 'Anonymous (CASE-2024-078)',
    organizationName: 'Central Hospital Yaoundé',
    serviceName: 'Medical Examination & Forensic Assessment',
    date: '08 Jun 2024',
    time: '11:30 AM',
    status: 'Confirmed',
    type: 'Medical'
  },
  {
    id: 'APT-002',
    victimName: 'Marie Dupont',
    organizationName: "Women's Legal Aid Center",
    serviceName: 'Legal Protection Consultation',
    date: '10 Jun 2024',
    time: '02:00 PM',
    status: 'Pending',
    type: 'Legal'
  },
  {
    id: 'APT-003',
    victimName: 'Emmanuel K.',
    organizationName: 'Central Hospital Yaoundé',
    serviceName: 'Trauma & Psychosocial Counseling',
    date: '07 Jun 2024',
    time: '10:00 AM',
    status: 'Confirmed',
    type: 'Psychosocial'
  }
];

export const mockThreads: MessageThread[] = [
  {
    id: 'TH-001',
    senderName: 'Aline Ndey',
    senderRole: 'Social Worker',
    lastMessage: 'Please remember our medical review appointment tomorrow.',
    timestamp: '10:30 AM',
    unreadCount: 2
  },
  {
    id: 'TH-002',
    senderName: 'Central Hospital Medical Team',
    senderRole: 'Hospital',
    lastMessage: 'The forensic report for case CASE-2024-078 is ready.',
    timestamp: 'Yesterday',
    unreadCount: 0
  },
  {
    id: 'TH-003',
    senderName: "Women's Legal Aid Center",
    senderRole: 'Legal Counsel',
    lastMessage: 'Please bring the requested identification documents.',
    timestamp: '2 days ago',
    unreadCount: 0
  }
];

export const mockMessages: Message[] = [
  {
    id: 'MSG-001',
    threadId: 'TH-001',
    senderName: 'Aline Ndey',
    isSender: false,
    content: 'Hello, I have reviewed your incident report (INC-2024-125). We are coordinating emergency medical support immediately.',
    timestamp: '10:15 AM'
  },
  {
    id: 'MSG-002',
    threadId: 'TH-001',
    senderName: 'You',
    isSender: true,
    content: 'Thank you so much. What time is the appointment at Central Hospital?',
    timestamp: '10:20 AM'
  },
  {
    id: 'MSG-003',
    threadId: 'TH-001',
    senderName: 'Aline Ndey',
    isSender: false,
    content: 'Please remember our medical review appointment tomorrow at 11:30 AM.',
    timestamp: '10:30 AM'
  }
];

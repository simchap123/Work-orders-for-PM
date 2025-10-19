import { Role, Status, User, Property, WorkOrder, ActivityType } from './types';

export const USERS: User[] = [
  { id: 1, name: 'Alice (Master)', role: Role.MASTER_ADMIN, avatarUrl: 'https://picsum.photos/seed/alice/100' },
  { id: 2, name: 'Bob (Admin)', role: Role.ADMIN, avatarUrl: 'https://picsum.photos/seed/bob/100' },
  { id: 3, name: 'Charlie (PM)', role: Role.PROPERTY_MANAGER, avatarUrl: 'https://picsum.photos/seed/charlie/100' },
  { id: 4, name: 'Diana (Supervisor)', role: Role.SUPERVISOR, avatarUrl: 'https://picsum.photos/seed/diana/100' },
  { id: 5, name: 'Eve (Tech)', role: Role.TECHNICIAN, avatarUrl: 'https://picsum.photos/seed/eve/100' },
  { id: 6, name: 'Frank (Owner)', role: Role.OWNER, avatarUrl: 'https://picsum.photos/seed/frank/100' },
  { id: 7, name: 'Grace (Vendor)', role: Role.VENDOR, avatarUrl: 'https://picsum.photos/seed/grace/100' },
  { id: 8, name: 'Heidi (Tech)', role: Role.TECHNICIAN, avatarUrl: 'https://picsum.photos/seed/heidi/100' },
];

export const PROPERTIES: Property[] = [
  { id: 101, name: 'Gateway Apartments', address: '123 Main St, Anytown, USA' },
  { id: 102, name: 'Riverbend Lofts', address: '456 Oak Ave, Anytown, USA' },
  { id: 103, name: 'Crestview Towers', address: '789 Pine Ln, Anytown, USA' },
];

export const AVAILABLE_TAGS = ['Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting', 'Cleaning', 'Landscaping', 'Appliance', 'Safety', 'Inspection', 'Key', 'Lock'];

export const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: 2024001,
    title: 'Leaky Faucet in Unit 2B',
    description: 'Tenant in unit 2B reported a persistent drip from the kitchen sink faucet. Needs immediate attention to prevent water damage.',
    status: Status.NEW,
    priority: 'High',
    propertyId: 101,
    unitNumber: '2B',
    tenant: {
      name: 'John Doe',
      phone: '555-123-4567',
      email: 'john.doe@example.com',
    },
    media: [],
    tags: ['Plumbing'],
    activity: [
      { id: 1, userId: 3, type: ActivityType.CREATED, timestamp: '2023-10-27T10:00:00Z', details: {} },
    ]
  },
  {
    id: 2024002,
    title: 'HVAC Filter Replacement',
    description: 'Scheduled quarterly HVAC filter replacement for all units in Building A.',
    status: Status.ASSIGNED,
    priority: 'Medium',
    propertyId: 101,
    assignedToId: 5,
    media: [],
    tags: ['HVAC', 'Inspection'],
    activity: [
      { id: 1, userId: 4, type: ActivityType.CREATED, timestamp: '2023-10-26T14:30:00Z', details: {} },
      { id: 2, userId: 4, type: ActivityType.ASSIGNMENT, timestamp: '2023-10-26T14:31:00Z', details: { assignedToId: 5 } },
      { id: 3, userId: 4, type: ActivityType.STATUS_CHANGE, timestamp: '2023-10-26T14:31:00Z', details: { oldStatus: Status.NEW, newStatus: Status.ASSIGNED } },
      { id: 4, userId: 4, type: ActivityType.NOTE, timestamp: '2023-10-26T14:35:00Z', details: { content: 'Eve, please complete by EOD Friday.' } },
    ]
  },
  {
    id: 2024003,
    title: 'Broken window in lobby',
    description: 'The main lobby window was cracked. Awaiting quote from vendor.',
    status: Status.ON_HOLD,
    priority: 'High',
    propertyId: 102,
    vendorId: 7,
    media: [{ id: 1, url: 'https://picsum.photos/seed/window/400/300', type: 'image', uploadedBy: 3, timestamp: '2023-10-25T09:13:00Z' }],
    tags: ['Carpentry', 'Safety'],
    activity: [
      { id: 1, userId: 3, type: ActivityType.CREATED, timestamp: '2023-10-25T09:12:00Z', details: {} },
      { id: 2, userId: 3, type: ActivityType.ASSIGNMENT, timestamp: '2023-10-25T09:14:00Z', details: { assignedToId: 7 } },
      { id: 3, userId: 3, type: ActivityType.STATUS_CHANGE, timestamp: '2023-10-25T09:14:00Z', details: { oldStatus: Status.NEW, newStatus: Status.ON_HOLD } },
      { id: 4, userId: 3, type: ActivityType.NOTE, timestamp: '2023-10-25T09:15:00Z', details: { content: 'Contacted Grace for a quote. Waiting for response.' } },
    ]
  },
  {
    id: 2024004,
    title: 'Paint touch-up in common hallway',
    description: 'Scuff marks on the 3rd-floor hallway walls need to be touched up.',
    status: Status.IN_PROGRESS,
    priority: 'Low',
    propertyId: 103,
    assignedToId: 8,
    media: [],
    tags: ['Painting'],
    activity: [
        { id: 1, userId: 4, type: ActivityType.CREATED, timestamp: '2023-10-24T11:00:00Z', details: {} },
        { id: 2, userId: 4, type: ActivityType.ASSIGNMENT, timestamp: '2023-10-24T11:01:00Z', details: { assignedToId: 8 } },
        { id: 3, userId: 4, type: ActivityType.STATUS_CHANGE, timestamp: '2023-10-24T11:01:00Z', details: { oldStatus: Status.NEW, newStatus: Status.ASSIGNED } },
        { id: 4, userId: 8, type: ActivityType.STATUS_CHANGE, timestamp: '2023-10-24T13:00:00Z', details: { oldStatus: Status.ASSIGNED, newStatus: Status.IN_PROGRESS } },
    ]
  },
  {
    id: 2024005,
    title: 'Annual Fire Extinguisher Inspection',
    description: 'Completed the annual fire extinguisher inspection for all buildings.',
    status: Status.COMPLETED,
    priority: 'Medium',
    propertyId: 101,
    assignedToId: 5,
    media: [],
    tags: ['Safety', 'Inspection'],
    activity: [
        { id: 1, userId: 4, type: ActivityType.CREATED, timestamp: '2023-10-20T08:00:00Z', details: {} },
        { id: 2, userId: 4, type: ActivityType.ASSIGNMENT, timestamp: '2023-10-20T08:01:00Z', details: { assignedToId: 5 } },
        { id: 3, userId: 4, type: ActivityType.STATUS_CHANGE, timestamp: '2023-10-20T08:01:00Z', details: { oldStatus: Status.NEW, newStatus: Status.ASSIGNED } },
        { id: 4, userId: 5, type: ActivityType.STATUS_CHANGE, timestamp: '2023-10-20T15:45:00Z', details: { oldStatus: Status.IN_PROGRESS, newStatus: Status.COMPLETED } },
        { id: 5, userId: 5, type: ActivityType.NOTE, timestamp: '2023-10-20T15:45:00Z', details: { content: 'All extinguishers passed inspection. Tags updated.' } },
    ]
  },
  {
    id: 2024006,
    title: 'Landscaping Mulch Refresh',
    description: 'Mulch in all garden beds was refreshed. Project is closed.',
    status: Status.CLOSED,
    priority: 'Low',
    propertyId: 102,
    vendorId: 7,
    media: [],
    tags: ['Landscaping'],
    activity: [
        { id: 1, userId: 3, type: ActivityType.CREATED, timestamp: '2023-09-15T09:00:00Z', details: {} },
        { id: 2, userId: 3, type: ActivityType.STATUS_CHANGE, timestamp: '2023-09-20T16:00:00Z', details: { oldStatus: Status.COMPLETED, newStatus: Status.CLOSED } },
    ]
  },
];

export const STATUS_DOT_COLORS: { [key in Status]: string } = {
  [Status.NEW]: 'bg-blue-500',
  [Status.ASSIGNED]: 'bg-indigo-500',
  [Status.IN_PROGRESS]: 'bg-yellow-500',
  [Status.ON_HOLD]: 'bg-gray-500',
  [Status.COMPLETED]: 'bg-green-500',
  [Status.CLOSED]: 'bg-purple-500',
};

export const PRIORITY_COLORS: { [key: string]: string } = {
  'Low': 'text-green-500',
  'Medium': 'text-yellow-500',
  'High': 'text-red-500',
};

export const ASSIGNABLE_ROLES = [Role.MASTER_ADMIN, Role.ADMIN, Role.PROPERTY_MANAGER, Role.SUPERVISOR];
export const CREATION_ROLES = [Role.MASTER_ADMIN, Role.ADMIN, Role.PROPERTY_MANAGER, Role.SUPERVISOR];
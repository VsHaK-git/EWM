export type UserRole = 'individual' | 'organization' | 'collector' | 'recycler' | 'admin';

export type OperationalStatus =
  | 'REQUESTED'
  | 'SCHEDULED'
  | 'ASSIGNED'
  | 'PICKUP_IN_PROGRESS'
  | 'COLLECTED'
  | 'IN_TRANSIT'
  | 'RECEIVED_BY_RECYCLER'
  | 'UNDER_PROCESSING'
  | 'PROCESSING_COMPLETED'
  | 'CERTIFICATE_ISSUED'
  | 'CANCELLED'
  | 'PICKUP_FAILED'
  | 'WEIGHT_DISCREPANCY'
  | 'REQUIRES_REVIEW';

export type EWasteCategory = 
  | 'Computing'
  | 'Mobile & Communication'
  | 'Consumer Electronics'
  | 'Electrical/Electronic Accessories';

export interface EWasteItem {
  id: string;
  category: EWasteCategory;
  subCategory: string; // e.g. Laptop, Desktop, Monitor, Keyboard, Charger, TV, UPS
  quantity: number;
  condition: 'Working' | 'Non-working' | 'Damaged' | 'Mixed' | 'Obsolete';
  estimatedWeightKg?: number;
  notes?: string;
  photos?: string[];
}

export interface CustodyEvent {
  id: string;
  timestamp: string;
  status: OperationalStatus;
  title: string;
  description: string;
  responsibleParty: string;
  role: string;
  location: string;
  weightKg?: number;
  photoUrl?: string;
  documentRef?: string;
}

export interface PickupRequest {
  id: string; // e.g. EW-2026-004821
  type: 'doorstep' | 'dropoff';
  userId: string;
  userName: string;
  userType: 'individual' | 'organization';
  organizationName?: string;
  contactPhone: string;
  contactEmail: string;
  address: {
    line1: string;
    area: string; // e.g. Pimpri, Wakad, Aundh, Hinjawadi
    city: string; // Pune
    state: string; // Maharashtra
    pincode: string;
  };
  preferredDate: string;
  preferredTimeSlot: string;
  items: EWasteItem[];
  estimatedTotalWeightKg: number;
  actualCollectedWeightKg?: number;
  status: OperationalStatus;
  assignedCollectorId?: string;
  assignedCollectorName?: string;
  assignedRecyclerId?: string;
  assignedRecyclerName?: string;
  recyclerBatchId?: string;
  certificateId?: string;
  notes?: string;
  createdAt: string;
  timeline: CustodyEvent[];
  verificationProof?: {
    photos: string[];
    collectorNotes: string;
    verifiedAt: string;
    discrepancyReason?: string;
  };
}

export interface OrgAsset {
  id: string; // e.g. IT-2041
  name: string; // e.g. Dell Latitude 5420
  category: EWasteCategory;
  department: string; // e.g. Computer Science Lab, Accounts, IT Support
  serialNumber: string;
  purchaseYear: number;
  condition: 'Working' | 'Non-working' | 'Damaged' | 'Obsolete';
  disposalStatus: 'Active' | 'Pending' | 'Scheduled' | 'Handed Over' | 'Recycled';
  assignedRequestId?: string;
  estimatedWeightKg: number;
}

export interface RecyclerBatch {
  id: string; // e.g. RB-2026-00891
  batchNumber: string;
  recyclerId: string;
  recyclerName: string;
  facilityLocation: string; // Bhosari MIDC, Pune
  linkedRequestIds: string[];
  manifestItemsCount: number;
  expectedWeightKg: number;
  receivedWeightKg: number;
  receivedAt: string;
  processingStatus: 'RECEIVED' | 'IN_SORTING' | 'PROCESSED' | 'CERTIFIED';
  materialBreakdown?: {
    recyclableKg: number; // metals, printed circuit boards, high-grade plastic
    reusableKg: number; // working components, screens, memory
    controlledHazardousKg: number; // lead, mercury, lithium batteries, phosphor
    residualKg: number; // non-recoverable inert material
    recordedAt: string;
    operatorName: string;
  };
  certificateId?: string;
  discrepancyNote?: string;
}

export interface Certificate {
  id: string; // CERT-2026-001982
  certificateNumber: string;
  requestId: string;
  batchId: string;
  organizationName: string;
  generatorType: 'individual' | 'organization';
  generatorAddress: string;
  totalWeightKg: number;
  materialSummary: string;
  issueDate: string;
  collectionDate: string;
  completionDate: string;
  recyclerName: string;
  recyclerFacility: string;
  cpcbLicenseNumber: string; // India MoEFCC / CPCB authorization code
  mpcbConsentNumber: string; // Maharashtra Pollution Control Board
  verificationCode: string;
  qrPayload: string;
  breakdown: {
    metalsKg: number;
    plasticsKg: number;
    circuitBoardsKg: number;
    hazardousSafelyTreatedKg: number;
    reusableExtractedKg: number;
  };
  signatory: {
    name: string;
    title: string;
    organization: string;
  };
}

export interface CollectionCentre {
  id: string;
  name: string;
  area: string;
  address: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  acceptedCategories: EWasteCategory[];
  operatingHours: string;
  contactPhone: string;
  isOpen: boolean;
  isVerifiedPartner: boolean;
  managedBy: string;
  currentCapacityPercent: number;
}

export interface PartnerOrg {
  id: string;
  name: string;
  type: 'collector' | 'transporter' | 'recycler';
  contactPerson: string;
  phone: string;
  email: string;
  serviceAreas: string[];
  fleetSize?: number;
  facilityAddress: string;
  cpcbAuthorizationNo: string;
  mpcbStatus: 'Approved' | 'Renewal Pending' | 'Under Review';
  verificationStatus: 'Verified' | 'Pending Review' | 'Suspended';
  activeSince: string;
  totalCollectedOrProcessedKg: number;
}

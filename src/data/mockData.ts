import {
  PickupRequest,
  OrgAsset,
  RecyclerBatch,
  Certificate,
  CollectionCentre,
  PartnerOrg
} from '../types';

export const INITIAL_PICKUP_REQUESTS: PickupRequest[] = [
  {
    id: 'EW-2026-004821',
    type: 'doorstep',
    userId: 'usr_rahul_01',
    userName: 'Rahul Sharma',
    userType: 'individual',
    contactPhone: '+91 98231 44521',
    contactEmail: 'rahul.sharma@example.in',
    address: {
      line1: 'Flat 402, Rohan Tarang, Sector 24',
      area: 'Pimpri',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411018'
    },
    preferredDate: '2026-10-10',
    preferredTimeSlot: '2:00 PM – 4:00 PM',
    items: [
      { id: 'item-1', category: 'Computing', subCategory: 'Laptop', quantity: 3, condition: 'Non-working', estimatedWeightKg: 6.5 },
      { id: 'item-2', category: 'Computing', subCategory: 'Monitor', quantity: 2, condition: 'Working', estimatedWeightKg: 4.0 },
      { id: 'item-3', category: 'Computing', subCategory: 'Keyboard', quantity: 6, condition: 'Non-working', estimatedWeightKg: 3.0 },
      { id: 'item-4', category: 'Mobile & Communication', subCategory: 'Charger', quantity: 8, condition: 'Mixed', estimatedWeightKg: 1.5 }
    ],
    estimatedTotalWeightKg: 12.0,
    actualCollectedWeightKg: 11.6,
    status: 'COLLECTED',
    assignedCollectorId: 'col_sachin_01',
    assignedCollectorName: 'Sachin More (GreenLogix)',
    assignedRecyclerId: 'rec_maharecycle_01',
    assignedRecyclerName: 'MahaRecycle Facility (Bhosari MIDC)',
    recyclerBatchId: 'RB-2026-00891',
    notes: 'Fragile screens packed in bubble wrap. 2 older Dell laptops have batteries detached.',
    createdAt: '2026-10-05T09:30:00Z',
    verificationProof: {
      photos: [
        'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
      ],
      collectorNotes: 'Verified at site. 3 laptops, 2 monitors and peripherals safely bagged. Slight deviation from estimate: 11.6 kg digital scale reading.',
      verifiedAt: '2026-10-06T14:15:00Z'
    },
    timeline: [
      {
        id: 'ev-1',
        timestamp: '2026-10-05T09:30:00Z',
        status: 'REQUESTED',
        title: 'Request Created',
        description: 'Customer registered 4 item categories with 12.0 kg estimated weight.',
        responsibleParty: 'Rahul Sharma (Customer)',
        role: 'Citizen Generator',
        location: 'Pimpri, Pune'
      },
      {
        id: 'ev-2',
        timestamp: '2026-10-05T11:45:00Z',
        status: 'ASSIGNED',
        title: 'Collection Partner Assigned',
        description: 'Assigned to field executive Sachin More (Vehicle MH 14 GH 7820). Route scheduled for Oct 6.',
        responsibleParty: 'GreenLogix Dispatch Control',
        role: 'Logistics Partner',
        location: 'PCMC Hub, Pune'
      },
      {
        id: 'ev-3',
        timestamp: '2026-10-06T14:10:00Z',
        status: 'PICKUP_IN_PROGRESS',
        title: 'Arrived at Location',
        description: 'Collection executive reached customer doorstep in Pimpri.',
        responsibleParty: 'Sachin More',
        role: 'Collection Executive',
        location: 'Flat 402, Rohan Tarang, Pimpri'
      },
      {
        id: 'ev-4',
        timestamp: '2026-10-06T14:25:00Z',
        status: 'COLLECTED',
        title: 'Collection & Weight Verified',
        description: 'Material inspected, packaged, and verified on certified field digital scale. Recorded weight: 11.6 kg.',
        responsibleParty: 'Sachin More',
        role: 'Collection Executive',
        location: 'Pimpri, Pune',
        weightKg: 11.6,
        documentRef: 'MANIFEST-EW-4821-V1'
      },
      {
        id: 'ev-5',
        timestamp: '2026-10-07T08:30:00Z',
        status: 'IN_TRANSIT',
        title: 'Consolidated into Batch RB-2026-00891',
        description: 'Consolidated with regional pickups and dispatched to Bhosari MIDC processing unit.',
        responsibleParty: 'GreenLogix Fleet Operations',
        role: 'Transporter',
        location: 'Bhosari Industrial Corridor, Pune'
      }
    ]
  },
  {
    id: 'EW-2026-004827',
    type: 'doorstep',
    userId: 'usr_ananya_02',
    userName: 'Ananya Deshmukh',
    userType: 'individual',
    contactPhone: '+91 99220 18834',
    address: {
      line1: 'B-12, Green Acres Society, Kaspate Vasti',
      area: 'Wakad',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411057'
    },
    contactEmail: 'ananya.desh@gmail.com',
    preferredDate: '2026-10-10',
    preferredTimeSlot: '4:00 PM – 6:00 PM',
    items: [
      { id: 'item-20', category: 'Consumer Electronics', subCategory: 'Television (CRT/LCD)', quantity: 1, condition: 'Damaged', estimatedWeightKg: 5.5 },
      { id: 'item-21', category: 'Electrical/Electronic Accessories', subCategory: 'UPS & Inverter Batteries', quantity: 1, condition: 'Non-working', estimatedWeightKg: 2.5 }
    ],
    estimatedTotalWeightKg: 8.0,
    status: 'SCHEDULED',
    assignedCollectorId: 'col_sachin_01',
    assignedCollectorName: 'Sachin More (GreenLogix)',
    createdAt: '2026-10-05T12:00:00Z',
    timeline: [
      {
        id: 'ev-201',
        timestamp: '2026-10-05T12:00:00Z',
        status: 'REQUESTED',
        title: 'Request Created',
        description: 'Disposal request created for CRT display and small UPS.',
        responsibleParty: 'Ananya Deshmukh',
        role: 'Citizen Generator',
        location: 'Wakad, Pune'
      },
      {
        id: 'ev-202',
        timestamp: '2026-10-05T14:15:00Z',
        status: 'SCHEDULED',
        title: 'Pickup Scheduled',
        description: 'Doorstep collection scheduled for 10 Oct between 4-6 PM.',
        responsibleParty: 'EcoCycle Operations Team',
        role: 'Operations Desk',
        location: 'Pune Central Ops'
      }
    ]
  },
  {
    id: 'EW-2026-004832',
    type: 'doorstep',
    userId: 'usr_vikram_03',
    userName: 'Vikram Joshi (Consultant Office)',
    userType: 'individual',
    contactPhone: '+91 97654 32109',
    contactEmail: 'vikram.j@techarch.org',
    address: {
      line1: 'Office 301, Pride Silicon Plaza, Senapati Bapat Rd',
      area: 'Aundh',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411007'
    },
    preferredDate: '2026-10-10',
    preferredTimeSlot: '5:00 PM – 7:00 PM',
    items: [
      { id: 'item-31', category: 'Computing', subCategory: 'Desktop', quantity: 2, condition: 'Non-working', estimatedWeightKg: 16.0 },
      { id: 'item-32', category: 'Computing', subCategory: 'Printer', quantity: 1, condition: 'Non-working', estimatedWeightKg: 6.0 },
      { id: 'item-33', category: 'Mobile & Communication', subCategory: 'Router & Switch', quantity: 3, condition: 'Mixed', estimatedWeightKg: 3.0 }
    ],
    estimatedTotalWeightKg: 25.0,
    status: 'ASSIGNED',
    assignedCollectorId: 'col_sachin_01',
    assignedCollectorName: 'Sachin More (GreenLogix)',
    createdAt: '2026-10-05T10:15:00Z',
    timeline: [
      {
        id: 'ev-301',
        timestamp: '2026-10-05T10:15:00Z',
        status: 'REQUESTED',
        title: 'Request Created',
        description: 'Consultant office e-waste batch logged.',
        responsibleParty: 'Vikram Joshi',
        role: 'Generator',
        location: 'Aundh, Pune'
      },
      {
        id: 'ev-302',
        timestamp: '2026-10-05T13:00:00Z',
        status: 'ASSIGNED',
        title: 'Assigned to Route #PUNE-WEST-04',
        description: 'Assigned to GreenLogix Logistics Pune for afternoon run.',
        responsibleParty: 'EcoCycle Routing Engine',
        role: 'System Administrator',
        location: 'Pune Operations'
      }
    ]
  },
  {
    id: 'EW-2026-004119',
    type: 'doorstep',
    userId: 'org_dypatil_01',
    userName: 'Dr. S. K. Mahajan (Dean Infrastructure)',
    userType: 'organization',
    organizationName: 'DY Patil Engineering College',
    contactPhone: '+91 94220 55112',
    contactEmail: 'estates@dypatil.edu.in',
    address: {
      line1: 'Sector 29, Nigdi Pradhikaran, Akurdi',
      area: 'Pimpri-Chinchwad',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411044'
    },
    preferredDate: '2026-10-02',
    preferredTimeSlot: '11:00 AM – 2:00 PM',
    items: [
      { id: 'item-41', category: 'Computing', subCategory: 'Desktop (Pentium/Core 2)', quantity: 24, condition: 'Obsolete', estimatedWeightKg: 140.0 },
      { id: 'item-42', category: 'Computing', subCategory: 'CRT & LCD Monitors', quantity: 18, condition: 'Non-working', estimatedWeightKg: 65.0 },
      { id: 'item-43', category: 'Computing', subCategory: 'Keyboards & Peripherals', quantity: 35, condition: 'Damaged', estimatedWeightKg: 22.0 },
      { id: 'item-44', category: 'Electrical/Electronic Accessories', subCategory: 'Cables & Heavy Adapters', quantity: 50, condition: 'Mixed', estimatedWeightKg: 21.6 }
    ],
    estimatedTotalWeightKg: 250.0,
    actualCollectedWeightKg: 248.6,
    status: 'CERTIFICATE_ISSUED',
    assignedCollectorId: 'col_sachin_01',
    assignedCollectorName: 'GreenLogix Heavy Freight Unit',
    assignedRecyclerId: 'rec_maharecycle_01',
    assignedRecyclerName: 'MahaRecycle Facility (Bhosari MIDC)',
    recyclerBatchId: 'RB-2026-00891',
    certificateId: 'CERT-2026-001982',
    createdAt: '2026-09-28T09:00:00Z',
    verificationProof: {
      photos: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80'
      ],
      collectorNotes: 'Bulk institutional pickup completed from Central Computer Center, Ground Floor. Weighbridge verification conducted at Bhosari weighbridge: Gross 248.6 kg.',
      verifiedAt: '2026-10-02T13:40:00Z'
    },
    timeline: [
      {
        id: 'ev-401',
        timestamp: '2026-09-28T09:00:00Z',
        status: 'REQUESTED',
        title: 'Bulk Institutional Request Registered',
        description: 'DY Patil Engineering College scheduled disposal for 77 laboratory computing assets.',
        responsibleParty: 'DY Patil Infrastructure Cell',
        role: 'Organization Admin',
        location: 'Akurdi, Pune'
      },
      {
        id: 'ev-402',
        timestamp: '2026-09-29T10:30:00Z',
        status: 'SCHEDULED',
        title: 'Bulk Pickup Approved & Slotted',
        description: 'Commercial vehicle MH 14 DX 4091 scheduled with 2 loading staff.',
        responsibleParty: 'EcoCycle Institutional Desk',
        role: 'Operations Desk',
        location: 'Pune Regional Office'
      },
      {
        id: 'ev-403',
        timestamp: '2026-10-02T11:15:00Z',
        status: 'COLLECTED',
        title: 'Material Loaded & Weighbridge Slotted',
        description: 'Verified on calibrated electronic scale. Handover signed by Dr. Mahajan.',
        responsibleParty: 'GreenLogix Logistics',
        role: 'Logistics Partner',
        location: 'Akurdi, Pune',
        weightKg: 248.6
      },
      {
        id: 'ev-404',
        timestamp: '2026-10-03T15:20:00Z',
        status: 'RECEIVED_BY_RECYCLER',
        title: 'Received at Recycler Facility',
        description: 'Batch intake confirmed at MahaRecycle Bhosari MIDC plant. Inbound manifest verified.',
        responsibleParty: 'MahaRecycle Facility Incharge',
        role: 'Recycling Operator',
        location: 'Bhosari MIDC, Pune',
        weightKg: 248.6
      },
      {
        id: 'ev-405',
        timestamp: '2026-10-04T17:00:00Z',
        status: 'PROCESSING_COMPLETED',
        title: 'Material Sorting & Shredding Completed',
        description: 'Segregated into 142.2 kg ferrous/non-ferrous metals, 48.4 kg engineered plastic, 36.5 kg circuit boards, and safe neutralization of lead glass.',
        responsibleParty: 'MahaRecycle Operations Engineer',
        role: 'Recycling Engineer',
        location: 'Bhosari MIDC Unit 2'
      },
      {
        id: 'ev-406',
        timestamp: '2026-10-08T10:00:00Z',
        status: 'CERTIFICATE_ISSUED',
        title: 'Compliance Certificate Generated',
        description: 'Form 6 E-Waste Manifest and Certificate of Responsible Recycling issued with digital verification QR.',
        responsibleParty: 'State Compliance Officer (EcoCycle)',
        role: 'Compliance Auditor',
        location: 'Pune Regulatory Office',
        documentRef: 'CERT-2026-001982'
      }
    ]
  },
  {
    id: 'EW-2026-004901',
    type: 'dropoff',
    userId: 'usr_priya_04',
    userName: 'Priya Kulkarni',
    userType: 'individual',
    contactPhone: '+91 98811 22334',
    contactEmail: 'priya.k@outlook.com',
    address: {
      line1: '14, Mayur Colony, Kothrud',
      area: 'Kothrud',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411038'
    },
    preferredDate: '2026-10-07',
    preferredTimeSlot: '11:00 AM – 1:00 PM',
    items: [
      { id: 'item-51', category: 'Mobile & Communication', subCategory: 'Mobile phone', quantity: 2, condition: 'Damaged', estimatedWeightKg: 0.5 },
      { id: 'item-52', category: 'Electrical/Electronic Accessories', subCategory: 'Lithium-ion Batteries', quantity: 4, condition: 'Non-working', estimatedWeightKg: 0.8 },
      { id: 'item-53', category: 'Mobile & Communication', subCategory: 'Cables & Earphones', quantity: 6, condition: 'Non-working', estimatedWeightKg: 0.4 }
    ],
    estimatedTotalWeightKg: 1.7,
    actualCollectedWeightKg: 1.8,
    status: 'RECEIVED_BY_RECYCLER',
    assignedRecyclerId: 'rec_maharecycle_01',
    assignedRecyclerName: 'MahaRecycle Facility (Bhosari MIDC)',
    createdAt: '2026-10-06T08:00:00Z',
    timeline: [
      {
        id: 'ev-501',
        timestamp: '2026-10-06T08:00:00Z',
        status: 'REQUESTED',
        title: 'Drop-off Slotted at Kothrud Depot',
        description: 'Citizen dropped off mobile accessories at EcoCycle Kothrud Centre.',
        responsibleParty: 'Priya Kulkarni',
        role: 'Citizen Generator',
        location: 'Kothrud, Pune'
      },
      {
        id: 'ev-502',
        timestamp: '2026-10-06T11:30:00Z',
        status: 'COLLECTED',
        title: 'Depot Intake Confirmed',
        description: 'Weighed on depot precision balance: 1.8 kg. Deposited into safe battery containment.',
        responsibleParty: 'Kothrud Depot Manager (Mr. Patil)',
        role: 'Depot Staff',
        location: 'Kothrud Depot, Pune',
        weightKg: 1.8
      }
    ]
  }
];

export const INITIAL_ORG_ASSETS: OrgAsset[] = [
  {
    id: 'IT-2041',
    name: 'Dell Latitude 5420 Laptop',
    category: 'Computing',
    department: 'Computer Science Lab 3',
    serialNumber: 'CN-0M354K-70166-41A-0491',
    purchaseYear: 2018,
    condition: 'Non-working',
    disposalStatus: 'Pending',
    estimatedWeightKg: 2.1
  },
  {
    id: 'MON-1182',
    name: 'HP EliteDisplay E243 23.8-inch Monitor',
    category: 'Computing',
    department: 'Mechanical CAD Lab',
    serialNumber: '3CQ9421L89',
    purchaseYear: 2017,
    condition: 'Damaged',
    disposalStatus: 'Scheduled',
    assignedRequestId: 'EW-2026-004119',
    estimatedWeightKg: 3.8
  },
  {
    id: 'PC-0921',
    name: 'Lenovo ThinkCentre M720 Tower',
    category: 'Computing',
    department: 'Administrative Accounts',
    serialNumber: 'MJ06R921',
    purchaseYear: 2016,
    condition: 'Obsolete',
    disposalStatus: 'Pending',
    estimatedWeightKg: 7.2
  },
  {
    id: 'NET-402',
    name: 'Cisco Catalyst 2960 48-Port Switch',
    category: 'Mobile & Communication',
    department: 'Server Room / IT Cell',
    serialNumber: 'FCW2145A09P',
    purchaseYear: 2015,
    condition: 'Obsolete',
    disposalStatus: 'Pending',
    estimatedWeightKg: 5.4
  },
  {
    id: 'PWR-551',
    name: 'APC Smart-UPS 1500VA LCD 230V',
    category: 'Electrical/Electronic Accessories',
    department: 'Electronics & Telecomm Lab',
    serialNumber: 'AS1630140228',
    purchaseYear: 2017,
    condition: 'Non-working',
    disposalStatus: 'Scheduled',
    assignedRequestId: 'EW-2026-004119',
    estimatedWeightKg: 24.0
  },
  {
    id: 'PRN-304',
    name: 'Canon imageRUNNER 2206 Multifunction Printer',
    category: 'Computing',
    department: 'Exam Control Division',
    serialNumber: 'KLR38921',
    purchaseYear: 2018,
    condition: 'Damaged',
    disposalStatus: 'Pending',
    estimatedWeightKg: 28.5
  },
  {
    id: 'LAB-109',
    name: 'Rigol Digital Oscilloscope DS1054Z (Damaged PCB)',
    category: 'Electrical/Electronic Accessories',
    department: 'Instrumentation Lab',
    serialNumber: 'DS1ZA22300481',
    purchaseYear: 2019,
    condition: 'Damaged',
    disposalStatus: 'Pending',
    estimatedWeightKg: 3.2
  }
];

export const INITIAL_RECYCLER_BATCHES: RecyclerBatch[] = [
  {
    id: 'RB-2026-00891',
    batchNumber: 'RB-2026-00891',
    recyclerId: 'rec_maharecycle_01',
    recyclerName: 'MahaRecycle Industrial Complex',
    facilityLocation: 'Plot E-42, Bhosari MIDC, Pune 411026',
    linkedRequestIds: ['EW-2026-004821', 'EW-2026-004119', 'EW-2026-004901'],
    manifestItemsCount: 146,
    expectedWeightKg: 262.3,
    receivedWeightKg: 262.0,
    receivedAt: '2026-10-07T11:00:00Z',
    processingStatus: 'IN_SORTING',
    materialBreakdown: {
      recyclableKg: 154.6,
      reusableKg: 52.8,
      controlledHazardousKg: 35.4,
      residualKg: 19.2,
      recordedAt: '2026-10-08T09:30:00Z',
      operatorName: 'Manoj Salve (Lead Sorting Engineer)'
    },
    certificateId: 'CERT-2026-001982'
  },
  {
    id: 'RB-2026-00890',
    batchNumber: 'RB-2026-00890',
    recyclerId: 'rec_maharecycle_01',
    recyclerName: 'MahaRecycle Industrial Complex',
    facilityLocation: 'Plot E-42, Bhosari MIDC, Pune 411026',
    linkedRequestIds: ['EW-2026-003901', 'EW-2026-003945'],
    manifestItemsCount: 88,
    expectedWeightKg: 156.9,
    receivedWeightKg: 156.9,
    receivedAt: '2026-09-30T10:15:00Z',
    processingStatus: 'CERTIFIED',
    materialBreakdown: {
      recyclableKg: 92.4,
      reusableKg: 31.7,
      controlledHazardousKg: 21.3,
      residualKg: 11.5,
      recordedAt: '2026-10-02T16:00:00Z',
      operatorName: 'Prakash Gaikwad'
    },
    certificateId: 'CERT-2026-001940'
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'CERT-2026-001982',
    certificateNumber: 'CERT-2026-001982',
    requestId: 'EW-2026-004119',
    batchId: 'RB-2026-00891',
    organizationName: 'DY Patil Engineering College',
    generatorType: 'organization',
    generatorAddress: 'Sector 29, Nigdi Pradhikaran, Akurdi, Pune - 411044',
    totalWeightKg: 248.6,
    materialSummary: 'Obsolete computing lab workstations, CRT/LCD displays, power modules & IT peripherals',
    issueDate: '08 October 2026',
    collectionDate: '02 October 2026',
    completionDate: '07 October 2026',
    recyclerName: 'MahaRecycle Industrial Complex',
    recyclerFacility: 'Plot E-42, Bhosari MIDC, Pune 411026',
    cpcbLicenseNumber: 'CPCB/EW-REG/MH/2022/0412',
    mpcbConsentNumber: 'BO/MPCB/RO-PUNE/CONS-9912',
    verificationCode: 'MH-EW-2026-DYP-99182',
    qrPayload: 'https://ecocycle.in/verify/CERT-2026-001982?code=MH-EW-2026-DYP-99182',
    breakdown: {
      metalsKg: 142.2,
      plasticsKg: 48.4,
      circuitBoardsKg: 36.5,
      hazardousSafelyTreatedKg: 14.5,
      reusableExtractedKg: 7.0
    },
    signatory: {
      name: 'Dr. Rameshwar Kulkarni',
      title: 'Chief Technical Director & CPCB Authorized Signatory',
      organization: 'MahaRecycle Industrial Technologies'
    }
  },
  {
    id: 'CERT-2026-001940',
    certificateNumber: 'CERT-2026-001940',
    requestId: 'EW-2026-003901',
    batchId: 'RB-2026-00890',
    organizationName: 'Tata Elxsi Design Center',
    generatorType: 'organization',
    generatorAddress: 'RGIP Phase 1, Hinjawadi, Pune - 411057',
    totalWeightKg: 156.9,
    materialSummary: 'Corporate office monitors, docking stations, structured cabling and desktop towers',
    issueDate: '03 October 2026',
    collectionDate: '29 September 2026',
    completionDate: '02 October 2026',
    recyclerName: 'MahaRecycle Industrial Complex',
    recyclerFacility: 'Plot E-42, Bhosari MIDC, Pune 411026',
    cpcbLicenseNumber: 'CPCB/EW-REG/MH/2022/0412',
    mpcbConsentNumber: 'BO/MPCB/RO-PUNE/CONS-9912',
    verificationCode: 'MH-EW-2026-TX-88201',
    qrPayload: 'https://ecocycle.in/verify/CERT-2026-001940?code=MH-EW-2026-TX-88201',
    breakdown: {
      metalsKg: 92.4,
      plasticsKg: 31.7,
      circuitBoardsKg: 21.3,
      hazardousSafelyTreatedKg: 7.2,
      reusableExtractedKg: 4.3
    },
    signatory: {
      name: 'Dr. Rameshwar Kulkarni',
      title: 'Chief Technical Director & CPCB Authorized Signatory',
      organization: 'MahaRecycle Industrial Technologies'
    }
  }
];

export const INITIAL_COLLECTION_CENTRES: CollectionCentre[] = [
  {
    id: 'cc-pimpri',
    name: 'EcoCycle Collection Centre — Pimpri',
    area: 'Pimpri-Chinchwad',
    address: 'Near Old Mumbai-Pune Highway, Pimpri Chinchwad Municipal Area',
    pincode: '411018',
    coordinates: { lat: 18.6298, lng: 73.7997 },
    acceptedCategories: [
      'Computing',
      'Mobile & Communication',
      'Consumer Electronics',
      'Electrical/Electronic Accessories'
    ],
    operatingHours: '10:00 AM – 6:00 PM (Mon - Sat)',
    contactPhone: '+91 20 2742 8890',
    isOpen: true,
    isVerifiedPartner: true,
    managedBy: 'GreenLogix Operations Pvt Ltd',
    currentCapacityPercent: 62
  },
  {
    id: 'cc-wakad',
    name: 'EcoCycle Hub — Wakad / Hinjawadi',
    area: 'Wakad',
    address: 'Survey 142/2, Datta Mandir Road, Near Hinjawadi Flyover',
    pincode: '411057',
    coordinates: { lat: 18.5987, lng: 73.7631 },
    acceptedCategories: [
      'Computing',
      'Mobile & Communication',
      'Electrical/Electronic Accessories'
    ],
    operatingHours: '09:30 AM – 6:30 PM (Daily)',
    contactPhone: '+91 20 6711 4400',
    isOpen: true,
    isVerifiedPartner: true,
    managedBy: 'EcoCycle Direct Civic Cell',
    currentCapacityPercent: 44
  },
  {
    id: 'cc-aundh',
    name: 'Aundh Civic Drop-off Point',
    area: 'Aundh',
    address: 'Near Parihar Chowk, Ward Office Civic Amenity Plot',
    pincode: '411007',
    coordinates: { lat: 18.5580, lng: 73.8075 },
    acceptedCategories: [
      'Mobile & Communication',
      'Computing',
      'Electrical/Electronic Accessories'
    ],
    operatingHours: '10:00 AM – 5:00 PM (Tue - Sun)',
    contactPhone: '+91 20 2588 1209',
    isOpen: true,
    isVerifiedPartner: true,
    managedBy: 'Pune PMC Smart City Initiative',
    currentCapacityPercent: 78
  },
  {
    id: 'cc-kothrud',
    name: 'Kothrud Recycling Depot',
    area: 'Kothrud',
    address: 'Off Karve Road, Near Ideal Colony Ground',
    pincode: '411038',
    coordinates: { lat: 18.5074, lng: 73.8077 },
    acceptedCategories: [
      'Computing',
      'Mobile & Communication',
      'Consumer Electronics',
      'Electrical/Electronic Accessories'
    ],
    operatingHours: '10:00 AM – 6:00 PM (Mon - Sat)',
    contactPhone: '+91 20 2544 9871',
    isOpen: true,
    isVerifiedPartner: true,
    managedBy: 'GreenLogix Logistics',
    currentCapacityPercent: 55
  },
  {
    id: 'cc-bhosari',
    name: 'MahaRecycle Intake Terminal',
    area: 'Bhosari MIDC',
    address: 'Plot E-42, MIDC Bhosari, Industrial Estate',
    pincode: '411026',
    coordinates: { lat: 18.6410, lng: 73.8470 },
    acceptedCategories: [
      'Computing',
      'Mobile & Communication',
      'Consumer Electronics',
      'Electrical/Electronic Accessories'
    ],
    operatingHours: '08:00 AM – 8:00 PM (Mon - Sat)',
    contactPhone: '+91 20 2712 0044',
    isOpen: true,
    isVerifiedPartner: true,
    managedBy: 'MahaRecycle Industrial Complex',
    currentCapacityPercent: 38
  },
  {
    id: 'cc-camp',
    name: 'Pune Camp Civic Collection Counter',
    area: 'Camp / MG Road',
    address: 'East Street, Opposite Cantonment Board Complex',
    pincode: '411001',
    coordinates: { lat: 18.5140, lng: 73.8790 },
    acceptedCategories: [
      'Mobile & Communication',
      'Electrical/Electronic Accessories'
    ],
    operatingHours: '11:00 AM – 5:30 PM (Wed - Sun)',
    contactPhone: '+91 20 2613 4001',
    isOpen: false,
    isVerifiedPartner: true,
    managedBy: 'Cantonment Green Cell',
    currentCapacityPercent: 90
  }
];

export const INITIAL_PARTNERS: PartnerOrg[] = [
  {
    id: 'part_greenlogix',
    name: 'GreenLogix Logistics & Reverse Supply Chain',
    type: 'collector',
    contactPerson: 'Sachin More (Operations Head)',
    phone: '+91 98220 90123',
    email: 'ops@greenlogixpune.com',
    serviceAreas: ['Pimpri-Chinchwad', 'Wakad', 'Hinjawadi', 'Aundh', 'Baner', 'Shivajinagar'],
    fleetSize: 14,
    facilityAddress: 'Hub 12, Pimpri Industrial Zone, Pune',
    cpcbAuthorizationNo: 'CPCB/MHA/COLL-2023/889',
    mpcbStatus: 'Approved',
    verificationStatus: 'Verified',
    activeSince: '2023',
    totalCollectedOrProcessedKg: 48920
  },
  {
    id: 'part_maharecycle',
    name: 'MahaRecycle Industrial Technologies Pvt Ltd',
    type: 'recycler',
    contactPerson: 'Dr. Rameshwar Kulkarni',
    phone: '+91 20 2712 0044',
    email: 'compliance@maharecycle.in',
    serviceAreas: ['Pune Metropolitan Area', 'PCMC', 'Talegaon', 'Chakan', 'Baramati'],
    facilityAddress: 'Plot E-42, Bhosari MIDC, Pune 411026',
    cpcbAuthorizationNo: 'CPCB/EW-REG/MH/2022/0412',
    mpcbStatus: 'Approved',
    verificationStatus: 'Verified',
    activeSince: '2021',
    totalCollectedOrProcessedKg: 312450
  },
  {
    id: 'part_swiftpick',
    name: 'SwiftPick Urban CleanTech Services',
    type: 'transporter',
    contactPerson: 'Milind Ranade',
    phone: '+91 98900 11223',
    email: 'milind@swiftpick.co.in',
    serviceAreas: ['Kothrud', 'Karve Nagar', 'Deccan', 'Swargate', 'Hadapsar'],
    fleetSize: 8,
    facilityAddress: 'Survey 22, Sinhagad Road, Pune',
    cpcbAuthorizationNo: 'CPCB/MHA/TR-2024/104',
    mpcbStatus: 'Approved',
    verificationStatus: 'Verified',
    activeSince: '2024',
    totalCollectedOrProcessedKg: 18400
  }
];

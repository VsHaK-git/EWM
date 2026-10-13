import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  OperationalStatus,
  PickupRequest,
  OrgAsset,
  RecyclerBatch,
  Certificate,
  CollectionCentre,
  PartnerOrg,
  CustodyEvent
} from '../types';
import {
  INITIAL_PICKUP_REQUESTS,
  INITIAL_ORG_ASSETS,
  INITIAL_RECYCLER_BATCHES,
  INITIAL_CERTIFICATES,
  INITIAL_COLLECTION_CENTRES,
  INITIAL_PARTNERS
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Data
  pickupRequests: PickupRequest[];
  orgAssets: OrgAsset[];
  recyclerBatches: RecyclerBatch[];
  certificates: Certificate[];
  collectionCentres: CollectionCentre[];
  partners: PartnerOrg[];
  
  // Tracking
  trackingQuery: string;
  setTrackingQuery: (q: string) => void;
  selectedTrackingRequest: PickupRequest | null;
  setSelectedTrackingRequest: (req: PickupRequest | null) => void;
  findRequestById: (id: string) => PickupRequest | undefined;
  
  // Modals & views
  isNewRequestOpen: boolean;
  setIsNewRequestOpen: (open: boolean) => void;
  selectedCertificate: Certificate | null;
  setSelectedCertificate: (cert: Certificate | null) => void;
  isClassifierOpen: boolean;
  setIsClassifierOpen: (open: boolean) => void;

  // Actions
  createPickupRequest: (data: Partial<PickupRequest>) => PickupRequest;
  updateRequestStatus: (
    id: string,
    status: OperationalStatus,
    eventInfo: { title: string; description: string; responsibleParty: string; role: string; location: string; weightKg?: number }
  ) => void;
  verifyCollectorPickup: (
    requestId: string,
    actualWeightKg: number,
    photos: string[],
    notes: string,
    discrepancyReason?: string
  ) => void;
  receiveBatchAtRecycler: (batchId: string, receivedWeightKg: number) => void;
  recordBatchProcessing: (
    batchId: string,
    breakdown: {
      recyclableKg: number;
      reusableKg: number;
      controlledHazardousKg: number;
      residualKg: number;
      operatorName: string;
    }
  ) => void;
  issueCertificateForBatch: (batchId: string, requestId?: string) => Certificate;
  addOrgAsset: (asset: Omit<OrgAsset, 'id'>) => void;
  updateOrgAssetStatus: (assetId: string, status: OrgAsset['disposalStatus']) => void;
  scheduleBulkAssetPickup: (assetIds: string[], preferredDate: string, timeSlot: string) => PickupRequest;
  resetDemoData: () => void;
  
  // Notification toast
  toastMessage: { text: string; type: 'info' | 'success' | 'warning' | 'error' } | null;
  showToast: (text: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'ecocycle_role',
  REQUESTS: 'ecocycle_requests',
  ASSETS: 'ecocycle_assets',
  BATCHES: 'ecocycle_batches',
  CERTS: 'ecocycle_certs',
  CENTRES: 'ecocycle_centres',
  PARTNERS: 'ecocycle_partners'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole;
    if (saved === 'organization') return 'individual';
    return saved || 'individual';
  });

  const [activeTab, setActiveTab] = useState<string>('home');

  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return saved ? JSON.parse(saved) : INITIAL_PICKUP_REQUESTS;
  });

  const [orgAssets, setOrgAssets] = useState<OrgAsset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
    return saved ? JSON.parse(saved) : INITIAL_ORG_ASSETS;
  });

  const [recyclerBatches, setRecyclerBatches] = useState<RecyclerBatch[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BATCHES);
    return saved ? JSON.parse(saved) : INITIAL_RECYCLER_BATCHES;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CERTS);
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [collectionCentres, setCollectionCentres] = useState<CollectionCentre[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CENTRES);
    return saved ? JSON.parse(saved) : INITIAL_COLLECTION_CENTRES;
  });

  const [partners, setPartners] = useState<PartnerOrg[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PARTNERS);
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });

  const [trackingQuery, setTrackingQuery] = useState<string>('');
  const [selectedTrackingRequest, setSelectedTrackingRequest] = useState<PickupRequest | null>(null);

  const [isNewRequestOpen, setIsNewRequestOpen] = useState<boolean>(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isClassifierOpen, setIsClassifierOpen] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'info' | 'success' | 'warning' | 'error' } | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(pickupRequests));
  }, [pickupRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(orgAssets));
  }, [orgAssets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(recyclerBatches));
  }, [recyclerBatches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(certificates));
  }, [certificates]);

  const showToast = (text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4500);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    // adjust default tab for the role
    if (newRole === 'individual') setActiveTab('dashboard');
    else if (newRole === 'organization') setActiveTab('overview');
    else if (newRole === 'collector') setActiveTab('route');
    else if (newRole === 'recycler') setActiveTab('batches');
    else if (newRole === 'admin') setActiveTab('overview');
  };

  const findRequestById = (id: string): PickupRequest | undefined => {
    const cleanId = id.trim().toUpperCase();
    return pickupRequests.find(r => r.id.toUpperCase() === cleanId);
  };

  const createPickupRequest = (data: Partial<PickupRequest>): PickupRequest => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `EW-2026-00${randomSuffix}`;
    const timestamp = new Date().toISOString();

    const initialEvent: CustodyEvent = {
      id: `ev-${Date.now()}`,
      timestamp,
      status: 'REQUESTED',
      title: 'Request Registered',
      description: `E-waste registered with estimated weight ${data.estimatedTotalWeightKg || 0} kg.`,
      responsibleParty: data.userName || 'Citizen Generator',
      role: data.userType === 'organization' ? 'Organization Admin' : 'Citizen Generator',
      location: data.address?.area ? `${data.address.area}, ${data.address.city}` : 'Pune'
    };

    const newReq: PickupRequest = {
      id: newId,
      type: data.type || 'doorstep',
      userId: data.userId || 'usr_current',
      userName: data.userName || 'Rahul Sharma',
      userType: data.userType || (role === 'organization' ? 'organization' : 'individual'),
      organizationName: data.organizationName || (role === 'organization' ? 'DY Patil Engineering College' : undefined),
      contactPhone: data.contactPhone || '+91 98231 44521',
      contactEmail: data.contactEmail || 'rahul.sharma@example.in',
      address: data.address || {
        line1: 'Near Central Park',
        area: 'Aundh',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411007'
      },
      preferredDate: data.preferredDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      preferredTimeSlot: data.preferredTimeSlot || '2:00 PM – 4:00 PM',
      items: data.items || [],
      estimatedTotalWeightKg: data.estimatedTotalWeightKg || 5.0,
      status: 'REQUESTED',
      notes: data.notes || '',
      createdAt: timestamp,
      timeline: [initialEvent]
    };

    setPickupRequests(prev => [newReq, ...prev]);
    showToast(`Pickup request ${newId} created successfully`, 'success');
    return newReq;
  };

  const updateRequestStatus = (
    id: string,
    status: OperationalStatus,
    eventInfo: { title: string; description: string; responsibleParty: string; role: string; location: string; weightKg?: number }
  ) => {
    const timestamp = new Date().toISOString();
    setPickupRequests(prev =>
      prev.map(req => {
        if (req.id !== id) return req;
        const newEvent: CustodyEvent = {
          id: `ev-${Date.now()}`,
          timestamp,
          status,
          title: eventInfo.title,
          description: eventInfo.description,
          responsibleParty: eventInfo.responsibleParty,
          role: eventInfo.role,
          location: eventInfo.location,
          weightKg: eventInfo.weightKg
        };
        return {
          ...req,
          status,
          timeline: [...req.timeline, newEvent]
        };
      })
    );
  };

  const verifyCollectorPickup = (
    requestId: string,
    actualWeightKg: number,
    photos: string[],
    notes: string,
    discrepancyReason?: string
  ) => {
    const target = pickupRequests.find(r => r.id === requestId);
    if (!target) return;

    const timestamp = new Date().toISOString();
    const weightDiff = Math.abs((target.estimatedTotalWeightKg || 0) - actualWeightKg);
    const hasDiscrepancy = weightDiff > 2.0;
    const finalStatus: OperationalStatus = hasDiscrepancy ? 'WEIGHT_DISCREPANCY' : 'COLLECTED';

    const event: CustodyEvent = {
      id: `ev-${Date.now()}`,
      timestamp,
      status: finalStatus,
      title: hasDiscrepancy ? 'Collected with Weight Discrepancy' : 'Collection Completed & Weight Verified',
      description: `Collected on-site. Estimated: ${target.estimatedTotalWeightKg} kg | Actual certified weight: ${actualWeightKg} kg. ${notes}`,
      responsibleParty: 'Sachin More (GreenLogix Logistics)',
      role: 'Collection Executive',
      location: `${target.address.area}, Pune`,
      weightKg: actualWeightKg
    };

    setPickupRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          status: finalStatus,
          actualCollectedWeightKg: actualWeightKg,
          verificationProof: {
            photos: photos.length > 0 ? photos : [
              'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80'
            ],
            collectorNotes: notes,
            verifiedAt: timestamp,
            discrepancyReason: hasDiscrepancy ? discrepancyReason || `Weight variance of ${weightDiff.toFixed(1)} kg exceeds 2.0 kg tolerance threshold` : undefined
          },
          timeline: [...r.timeline, event]
        };
      })
    );

    if (hasDiscrepancy) {
      showToast(`Recorded ${requestId}: Weight Discrepancy noted (${actualWeightKg} kg vs est ${target.estimatedTotalWeightKg} kg)`, 'warning');
    } else {
      showToast(`Verified & Collected ${requestId} (${actualWeightKg} kg)`, 'success');
    }
  };

  const receiveBatchAtRecycler = (batchId: string, receivedWeightKg: number) => {
    const timestamp = new Date().toISOString();
    setRecyclerBatches(prev =>
      prev.map(b => {
        if (b.id !== batchId) return b;
        return {
          ...b,
          receivedWeightKg,
          receivedAt: timestamp,
          processingStatus: 'IN_SORTING'
        };
      })
    );

    // update linked requests
    const batch = recyclerBatches.find(b => b.id === batchId);
    if (batch) {
      setPickupRequests(prev =>
        prev.map(req => {
          if (batch.linkedRequestIds.includes(req.id)) {
            const event: CustodyEvent = {
              id: `ev-${Date.now()}`,
              timestamp,
              status: 'RECEIVED_BY_RECYCLER',
              title: `Received at Recycler Facility`,
              description: `Batch ${batchId} checked into MahaRecycle Bhosari MIDC. Inbound manifest verified.`,
              responsibleParty: 'Manoj Salve (Intake Officer)',
              role: 'Recycling Facility Intake',
              location: 'Plot E-42, Bhosari MIDC, Pune',
              weightKg: receivedWeightKg
            };
            return {
              ...req,
              status: 'RECEIVED_BY_RECYCLER',
              timeline: [...req.timeline, event]
            };
          }
          return req;
        })
      );
    }

    showToast(`Batch ${batchId} marked as received (${receivedWeightKg} kg)`, 'info');
  };

  const recordBatchProcessing = (
    batchId: string,
    breakdown: {
      recyclableKg: number;
      reusableKg: number;
      controlledHazardousKg: number;
      residualKg: number;
      operatorName: string;
    }
  ) => {
    const timestamp = new Date().toISOString();
    setRecyclerBatches(prev =>
      prev.map(b => {
        if (b.id !== batchId) return b;
        return {
          ...b,
          processingStatus: 'PROCESSED',
          materialBreakdown: {
            ...breakdown,
            recordedAt: timestamp
          }
        };
      })
    );

    // update linked requests
    const batch = recyclerBatches.find(b => b.id === batchId);
    if (batch) {
      setPickupRequests(prev =>
        prev.map(req => {
          if (batch.linkedRequestIds.includes(req.id)) {
            const event: CustodyEvent = {
              id: `ev-${Date.now()}`,
              timestamp,
              status: 'PROCESSING_COMPLETED',
              title: `Material Sorting & Recovery Complete`,
              description: `Processed: ${breakdown.recyclableKg}kg recyclable, ${breakdown.reusableKg}kg reusable, ${breakdown.controlledHazardousKg}kg controlled hazardous safe neutralization.`,
              responsibleParty: breakdown.operatorName,
              role: 'Lead Recycling Specialist',
              location: 'Bhosari MIDC Processing Line #3'
            };
            return {
              ...req,
              status: 'PROCESSING_COMPLETED',
              timeline: [...req.timeline, event]
            };
          }
          return req;
        })
      );
    }

    showToast(`Sorting and processing recorded for Batch ${batchId}`, 'success');
  };

  const issueCertificateForBatch = (batchId: string, targetRequestId?: string): Certificate => {
    const batch = recyclerBatches.find(b => b.id === batchId);
    const req = targetRequestId ? pickupRequests.find(r => r.id === targetRequestId) : (batch?.linkedRequestIds[0] ? pickupRequests.find(r => r.id === batch.linkedRequestIds[0]) : undefined);
    
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const certNum = `CERT-2026-00${Math.floor(1000 + Math.random() * 9000)}`;
    const issueDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const totalWeight = req?.actualCollectedWeightKg || batch?.receivedWeightKg || 120.0;

    const newCert: Certificate = {
      id: certNum,
      certificateNumber: certNum,
      requestId: req?.id || 'EW-2026-004119',
      batchId: batchId,
      organizationName: req?.organizationName || req?.userName || 'DY Patil Engineering College',
      generatorType: req?.userType || 'organization',
      generatorAddress: req ? `${req.address.line1}, ${req.address.area}, ${req.address.city} - ${req.address.pincode}` : 'Pune, Maharashtra',
      totalWeightKg: totalWeight,
      materialSummary: req?.items.map(i => `${i.quantity}x ${i.subCategory}`).join(', ') || 'Mixed obsolete computing and electrical accessories',
      issueDate,
      collectionDate: req?.preferredDate ? new Date(req.preferredDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '02 October 2026',
      completionDate: issueDate,
      recyclerName: 'MahaRecycle Industrial Complex',
      recyclerFacility: 'Plot E-42, Bhosari MIDC, Pune 411026',
      cpcbLicenseNumber: 'CPCB/EW-REG/MH/2022/0412',
      mpcbConsentNumber: 'BO/MPCB/RO-PUNE/CONS-9912',
      verificationCode: `MH-EW-2026-${randomCode}`,
      qrPayload: `https://ecocycle.in/verify/${certNum}?code=MH-EW-2026-${randomCode}`,
      breakdown: {
        metalsKg: +(totalWeight * 0.58).toFixed(1),
        plasticsKg: +(totalWeight * 0.20).toFixed(1),
        circuitBoardsKg: +(totalWeight * 0.14).toFixed(1),
        hazardousSafelyTreatedKg: +(totalWeight * 0.05).toFixed(1),
        reusableExtractedKg: +(totalWeight * 0.03).toFixed(1)
      },
      signatory: {
        name: 'Dr. Rameshwar Kulkarni',
        title: 'Chief Technical Director & CPCB Authorized Signatory',
        organization: 'MahaRecycle Industrial Technologies'
      }
    };

    setCertificates(prev => [newCert, ...prev]);

    // Update batch
    setRecyclerBatches(prev =>
      prev.map(b => (b.id === batchId ? { ...b, processingStatus: 'CERTIFIED', certificateId: certNum } : b))
    );

    // Update requests
    const timestamp = new Date().toISOString();
    if (req) {
      setPickupRequests(prev =>
        prev.map(r => {
          if (r.id === req.id) {
            const certEvent: CustodyEvent = {
              id: `ev-${Date.now()}`,
              timestamp,
              status: 'CERTIFICATE_ISSUED',
              title: 'Recycling Certificate Issued',
              description: `Official digital certificate ${certNum} generated with verifiable QR signature under E-Waste Rules 2022.`,
              responsibleParty: 'State Compliance Officer (EcoCycle)',
              role: 'Regulatory Compliance',
              location: 'Pune Regional Operations',
              documentRef: certNum
            };
            return {
              ...r,
              status: 'CERTIFICATE_ISSUED',
              certificateId: certNum,
              timeline: [...r.timeline, certEvent]
            };
          }
          return r;
        })
      );
    }

    showToast(`Compliance Certificate ${certNum} issued!`, 'success');
    return newCert;
  };

  const addOrgAsset = (asset: Omit<OrgAsset, 'id'>) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = asset.category === 'Computing' ? 'IT' : asset.category === 'Consumer Electronics' ? 'AV' : 'NET';
    const newId = `${prefix}-${randomNum}`;
    const newAsset: OrgAsset = {
      ...asset,
      id: newId
    };
    setOrgAssets(prev => [newAsset, ...prev]);
    showToast(`Asset ${newId} added to institution inventory`, 'success');
  };

  const updateOrgAssetStatus = (assetId: string, status: OrgAsset['disposalStatus']) => {
    setOrgAssets(prev =>
      prev.map(a => (a.id === assetId ? { ...a, disposalStatus: status } : a))
    );
  };

  const scheduleBulkAssetPickup = (assetIds: string[], preferredDate: string, timeSlot: string): PickupRequest => {
    const selectedAssets = orgAssets.filter(a => assetIds.includes(a.id));
    const totalEstWeight = selectedAssets.reduce((sum, a) => sum + (a.estimatedWeightKg || 4), 0);

    const items = selectedAssets.map(a => ({
      id: `bulk-item-${a.id}`,
      category: a.category,
      subCategory: `${a.name} (${a.id})`,
      quantity: 1,
      condition: a.condition,
      estimatedWeightKg: a.estimatedWeightKg
    }));

    const newReq = createPickupRequest({
      type: 'doorstep',
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
      preferredDate,
      preferredTimeSlot: timeSlot,
      items,
      estimatedTotalWeightKg: Math.round(totalEstWeight),
      notes: `Bulk asset disposal for ${assetIds.length} inventoried hardware items.`
    });

    // Mark assets as scheduled
    setOrgAssets(prev =>
      prev.map(a => (assetIds.includes(a.id) ? { ...a, disposalStatus: 'Scheduled', assignedRequestId: newReq.id } : a))
    );

    return newReq;
  };

  const resetDemoData = () => {
    localStorage.clear();
    setPickupRequests(INITIAL_PICKUP_REQUESTS);
    setOrgAssets(INITIAL_ORG_ASSETS);
    setRecyclerBatches(INITIAL_RECYCLER_BATCHES);
    setCertificates(INITIAL_CERTIFICATES);
    setCollectionCentres(INITIAL_COLLECTION_CENTRES);
    setPartners(INITIAL_PARTNERS);
    showToast('Platform reset to authentic Pune seed data', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        pickupRequests,
        orgAssets,
        recyclerBatches,
        certificates,
        collectionCentres,
        partners,
        trackingQuery,
        setTrackingQuery,
        selectedTrackingRequest,
        setSelectedTrackingRequest,
        findRequestById,
        isNewRequestOpen,
        setIsNewRequestOpen,
        selectedCertificate,
        setSelectedCertificate,
        isClassifierOpen,
        setIsClassifierOpen,
        createPickupRequest,
        updateRequestStatus,
        verifyCollectorPickup,
        receiveBatchAtRecycler,
        recordBatchProcessing,
        issueCertificateForBatch,
        addOrgAsset,
        updateOrgAssetStatus,
        scheduleBulkAssetPickup,
        resetDemoData,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

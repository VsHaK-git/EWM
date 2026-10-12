import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PickupRequest } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Truck,
  CheckCircle,
  AlertTriangle,
  Scale,
  MapPin,
  Clock,
  Phone,
  Camera,
  Navigation,
  FileCheck,
  ChevronRight,
  User
} from 'lucide-react';

export const CollectorDashboard: React.FC = () => {
  const {
    pickupRequests,
    verifyCollectorPickup,
    updateRequestStatus,
    setSelectedTrackingRequest,
    setActiveTab,
    showToast
  } = useApp();

  const [activeVerifyRequest, setActiveVerifyRequest] = useState<PickupRequest | null>(null);
  const [actualWeightInput, setActualWeightInput] = useState<string>('');
  const [collectorNotes, setCollectorNotes] = useState<string>('');
  const [discrepancyReason, setDiscrepancyReason] = useState<string>('');
  const [proofPhotos, setProofPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80'
  ]);

  // Collector filter
  const assignedList = pickupRequests.filter(
    r => r.status === 'ASSIGNED' || r.status === 'SCHEDULED' || r.status === 'PICKUP_IN_PROGRESS' || r.status === 'COLLECTED' || r.status === 'WEIGHT_DISCREPANCY'
  );

  const pendingStops = assignedList.filter(
    r => r.status === 'ASSIGNED' || r.status === 'SCHEDULED' || r.status === 'PICKUP_IN_PROGRESS'
  );

  const completedToday = assignedList.filter(
    r => r.status === 'COLLECTED' || r.status === 'WEIGHT_DISCREPANCY'
  );

  const totalCollectedTodayKg = completedToday.reduce(
    (sum, r) => sum + (r.actualCollectedWeightKg || 0),
    0
  );

  const handleStartPickup = (req: PickupRequest) => {
    updateRequestStatus(req.id, 'PICKUP_IN_PROGRESS', {
      title: 'En Route to Pickup Site',
      description: 'Collection vehicle dispatched. Driver Sachin More arriving shortly.',
      responsibleParty: 'Sachin More (GreenLogix Logistics)',
      role: 'Collection Executive',
      location: `${req.address.area}, Pune`
    });
    showToast(`Started route for ${req.id} in ${req.address.area}`, 'info');
  };

  const openVerifyModal = (req: PickupRequest) => {
    setActiveVerifyRequest(req);
    setActualWeightInput(req.actualCollectedWeightKg?.toString() || req.estimatedTotalWeightKg.toString());
    setCollectorNotes('Hardware inspected on-site. Verified components match customer inventory sheet.');
    setDiscrepancyReason('');
  };

  const handleCompleteVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVerifyRequest) return;

    const actual = parseFloat(actualWeightInput);
    if (isNaN(actual) || actual <= 0) {
      showToast('Please enter a valid scale weight in kg', 'error');
      return;
    }

    verifyCollectorPickup(
      activeVerifyRequest.id,
      actual,
      proofPhotos,
      collectorNotes,
      discrepancyReason
    );

    setActiveVerifyRequest(null);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-header-titles">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2>Field Logistics & Collection Console</h2>
            <span style={{ fontSize: '11px', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
              Executive: Sachin More (MH 14 GH 7820)
            </span>
          </div>
          <p>Assigned pickup stops across PCMC & Pune West corridor with digital weigh scale verification.</p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => showToast('Route optimized for Pune-West corridor: Pimpri → Wakad → Aundh', 'info')}
          >
            <Navigation size={14} color="var(--eco-primary)" />
            <span>Optimize GPS Route</span>
          </button>
        </div>
      </div>

      {/* KPI Stats (PRD Section 8) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Pending Stops Today</span>
            <Clock size={16} color="#b45309" />
          </div>
          <div className="kpi-card-value">{pendingStops.length}</div>
          <div className="kpi-card-subtitle">Pimpri, Wakad, Aundh</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Collected Today</span>
            <Scale size={16} color="var(--eco-primary)" />
          </div>
          <div className="kpi-card-value">{totalCollectedTodayKg.toFixed(1)} <span style={{ fontSize: '14px', fontWeight: 500 }}>kg</span></div>
          <div className="kpi-card-subtitle">Certified scale readings</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Van Capacity Utilized</span>
            <Truck size={16} color="#4338ca" />
          </div>
          <div className="kpi-card-value">38%</div>
          <div className="kpi-card-subtitle">Max payload: 850 kg (Tata Ace)</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Destination Facility</span>
            <FileCheck size={16} color="#059669" />
          </div>
          <div className="kpi-card-value" style={{ fontSize: '18px', paddingTop: '4px' }}>Bhosari MIDC</div>
          <div className="kpi-card-subtitle">MahaRecycle Plant #2</div>
        </div>
      </div>

      {/* Today's Route Operations Table (PRD Section 8) */}
      <div className="content-card">
        <div className="content-card-header">
          <h3>
            <Truck size={16} />
            <span>Today's Assigned Route Manifest</span>
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {assignedList.length} route stops slotted
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Request</th>
                <th>Area / Address</th>
                <th>Generator / Contact</th>
                <th>Est. vs Actual</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignedList.map(req => {
                const isCompleted = req.status === 'COLLECTED' || req.status === 'WEIGHT_DISCREPANCY';
                return (
                  <tr key={req.id}>
                    <td>
                      <span
                        className="id-tag"
                        onClick={() => {
                          setSelectedTrackingRequest(req);
                          setActiveTab('tracking');
                        }}
                      >
                        {req.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{req.address.area}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{req.address.line1}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{req.userName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={10} />
                        <span>{req.contactPhone}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>
                        {req.actualCollectedWeightKg ? `${req.actualCollectedWeightKg} kg` : `~${req.estimatedTotalWeightKg} kg`}
                      </div>
                      {req.actualCollectedWeightKg && Math.abs(req.actualCollectedWeightKg - req.estimatedTotalWeightKg) > 0.1 && (
                        <div style={{ fontSize: '11px', color: '#b91c1c' }}>
                          Est: {req.estimatedTotalWeightKg} kg
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '12px' }}>{req.preferredTimeSlot}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{req.preferredDate}</div>
                    </td>
                    <td>
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {req.status === 'ASSIGNED' || req.status === 'SCHEDULED' ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleStartPickup(req)}
                          >
                            <span>Start Route</span>
                          </button>
                        ) : req.status === 'PICKUP_IN_PROGRESS' ? (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => openVerifyModal(req)}
                          >
                            <Scale size={13} />
                            <span>Verify & Weigh</span>
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openVerifyModal(req)}
                            title="Re-inspect recorded scale verification"
                          >
                            <span>Inspect Proof</span>
                          </button>
                        )}

                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedTrackingRequest(req);
                            setActiveTab('tracking');
                          }}
                        >
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Field Scale Weighing & Verification Modal (PRD Section 9) */}
      {activeVerifyRequest && (
        <div className="modal-overlay">
          <div className="modal-dialog modal-lg">
            <div className="modal-header">
              <div>
                <h3>Field Collection & Scale Verification</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Pickup Stop: {activeVerifyRequest.id} — {activeVerifyRequest.address.area}
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveVerifyRequest(null)}>×</button>
            </div>

            <form onSubmit={handleCompleteVerification}>
              <div className="modal-body">
                {/* Site & Contact Confirmation */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Customer / Location
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginTop: '2px' }}>
                      {activeVerifyRequest.userName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {activeVerifyRequest.address.line1}, {activeVerifyRequest.address.area}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Phone: {activeVerifyRequest.contactPhone}
                    </div>
                  </div>

                  <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Initial Customer Estimate
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {activeVerifyRequest.estimatedTotalWeightKg} <span style={{ fontSize: '13px', fontWeight: 500 }}>kg</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {activeVerifyRequest.items.length} category entries logged
                    </div>
                  </div>
                </div>

                {/* Items Checklist */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Physical Item Inspection
                  </div>
                  <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Item Category</th>
                          <th>Qty</th>
                          <th>Condition</th>
                          <th>Est. Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeVerifyRequest.items.map(i => (
                          <tr key={i.id}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{i.subCategory}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{i.category}</div>
                            </td>
                            <td><strong>{i.quantity}</strong></td>
                            <td>{i.condition}</td>
                            <td>{i.estimatedWeightKg || '—'} kg</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actual Certified Scale Reading (PRD Section 9) */}
                <div style={{ padding: '16px', background: '#fafbfc', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                  <div className="form-group" style={{ marginBottom: '8px' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Actual Scale Reading (kg) <span className="required">*</span></span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Digital Field Scale Model: Kern EOE 150K</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Scale size={20} color="var(--eco-primary)" />
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        className="form-input"
                        value={actualWeightInput}
                        onChange={e => setActualWeightInput(e.target.value)}
                        style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', maxWidth: '200px' }}
                        required
                      />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>kg</span>
                    </div>
                  </div>

                  {/* Dynamic Weight Variance Display */}
                  {actualWeightInput && !isNaN(parseFloat(actualWeightInput)) && (
                    <div style={{ marginTop: '10px', fontSize: '13px' }}>
                      {(() => {
                        const actual = parseFloat(actualWeightInput);
                        const est = activeVerifyRequest.estimatedTotalWeightKg;
                        const diff = +(actual - est).toFixed(1);
                        const isSevere = Math.abs(diff) > 2.0;

                        return (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>Variance:</span>
                              <strong style={{ color: diff === 0 ? 'var(--text-primary)' : diff > 0 ? '#15803d' : '#b45309' }}>
                                {diff > 0 ? `+${diff}` : diff} kg
                              </strong>
                              {isSevere && (
                                <span style={{ fontSize: '11px', background: '#fee2e2', color: '#991b1b', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                  Discrepancy &gt; 2.0 kg
                                </span>
                              )}
                            </div>

                            {isSevere && (
                              <div style={{ marginTop: '10px' }}>
                                <label className="form-label" style={{ color: '#991b1b' }}>
                                  Reason for Weight Discrepancy <span className="required">*</span>
                                </label>
                                <input
                                  type="text"
                                  className="form-input"
                                  placeholder="E.g. Heavy internal copper transformers in UPS, missing CRT glass..."
                                  value={discrepancyReason}
                                  onChange={e => setDiscrepancyReason(e.target.value)}
                                  required
                                />
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Field Notes & Verification Photo Proof */}
                <div className="form-group">
                  <label className="form-label">Field Executive Notes</label>
                  <textarea
                    className="form-textarea"
                    value={collectorNotes}
                    onChange={e => setCollectorNotes(e.target.value)}
                    placeholder="Enter on-site notes, condition observations, bag serials..."
                    style={{ minHeight: '60px' }}
                  />
                </div>

                <div>
                  <div className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Proof Photographs Attached</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>1 photo captured</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {proofPhotos.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Weighing scale proof"
                        style={{ width: '90px', height: '65px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-light)' }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveVerifyRequest(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={15} />
                  <span>Confirm Scale Verification & Mark Collected</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

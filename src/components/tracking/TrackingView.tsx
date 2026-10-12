import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PickupRequest } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Timeline } from '../common/Timeline';
import {
  Search,
  CheckCircle,
  FileCheck2,
  AlertTriangle,
  Scale,
  Building,
  User,
  MapPin,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const TrackingView: React.FC = () => {
  const {
    pickupRequests,
    selectedTrackingRequest,
    setSelectedTrackingRequest,
    findRequestById,
    setSelectedCertificate,
    certificates
  } = useApp();

  const [inputVal, setInputVal] = useState<string>(selectedTrackingRequest?.id || 'EW-2026-004821');

  useEffect(() => {
    if (selectedTrackingRequest) {
      setInputVal(selectedTrackingRequest.id);
    } else if (pickupRequests.length > 0 && !selectedTrackingRequest) {
      setSelectedTrackingRequest(pickupRequests[0]);
    }
  }, [selectedTrackingRequest, pickupRequests]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const req = findRequestById(inputVal);
    if (req) {
      setSelectedTrackingRequest(req);
    }
  };

  const selectRequest = (req: PickupRequest) => {
    setInputVal(req.id);
    setSelectedTrackingRequest(req);
  };

  const currentReq = selectedTrackingRequest || pickupRequests[0];

  // Stage sequence mapping for high-level pipeline
  const getStageIndex = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return 1;
      case 'SCHEDULED':
      case 'ASSIGNED':
      case 'PICKUP_IN_PROGRESS':
        return 2;
      case 'COLLECTED':
      case 'WEIGHT_DISCREPANCY':
        return 3;
      case 'IN_TRANSIT':
      case 'RECEIVED_BY_RECYCLER':
        return 4;
      case 'UNDER_PROCESSING':
      case 'PROCESSING_COMPLETED':
        return 5;
      case 'CERTIFICATE_ISSUED':
        return 6;
      default:
        return 1;
    }
  };

  const currentStage = currentReq ? getStageIndex(currentReq.status) : 1;

  // Find linked certificate if any
  const linkedCert = currentReq?.certificateId
    ? certificates.find(c => c.id === currentReq.certificateId)
    : undefined;

  return (
    <div>
      {/* Top Title & Search Banner */}
      <div className="content-card" style={{ marginBottom: '20px' }}>
        <div className="content-card-body" style={{ padding: '24px' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--eco-primary)' }}>
              End-to-End Chain of Custody
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px', letterSpacing: '-0.4px' }}>
              Where did this e-waste go?
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '18px' }}>
              Inspect every handover event, certified scale verification, transport batch, and recycling audit record.
            </p>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', maxWidth: '520px', margin: '0 auto' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter Tracking ID (e.g. EW-2026-004821)"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  style={{ paddingLeft: '38px', height: '42px', fontSize: '14px', fontFamily: 'var(--font-mono)' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', height: '42px' }}>
                Track Custody
              </button>
            </form>

            {/* Quick Suggestions Chips */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quick sample IDs:</span>
              {pickupRequests.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => selectRequest(r)}
                  className={`filter-pill ${currentReq?.id === r.id ? 'active' : ''}`}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '3px 10px' }}
                >
                  {r.id} ({r.userType === 'organization' ? 'College' : 'Citizen'})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {currentReq ? (
        <div>
          {/* High-Level Milestone Stepper */}
          <div className="content-card" style={{ marginBottom: '24px' }}>
            <div className="content-card-body" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{currentReq.id}</h3>
                    <StatusBadge status={currentReq.status} />
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Registered by <strong>{currentReq.userName}</strong> {currentReq.organizationName && `(${currentReq.organizationName})`} on{' '}
                    {new Date(currentReq.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {linkedCert && (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setSelectedCertificate(linkedCert)}
                  >
                    <FileCheck2 size={15} />
                    <span>View Official Certificate ({linkedCert.id})</span>
                  </button>
                )}
              </div>

              {/* Progress Milestones */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginTop: '24px', position: 'relative' }}>
                {[
                  { step: 1, label: '1. Registered' },
                  { step: 2, label: '2. Assigned' },
                  { step: 3, label: '3. Collected' },
                  { step: 4, label: '4. At Recycler' },
                  { step: 5, label: '5. Processed' },
                  { step: 6, label: '6. Certified' }
                ].map(stage => {
                  const isDone = currentStage >= stage.step;
                  const isCurrent = currentStage === stage.step;
                  return (
                    <div
                      key={stage.step}
                      style={{
                        textAlign: 'center',
                        padding: '10px 4px',
                        background: isCurrent ? 'var(--eco-subtle)' : isDone ? '#f8fafc' : '#ffffff',
                        border: `1px solid ${isCurrent ? 'var(--eco-primary)' : isDone ? 'var(--border-strong)' : 'var(--border-light)'}`,
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: isDone ? 'var(--eco-primary)' : 'var(--bg-subtle)',
                          color: isDone ? '#ffffff' : 'var(--text-muted)',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 6px auto'
                        }}
                      >
                        {isDone ? <CheckCircle size={12} /> : stage.step}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: isCurrent ? 700 : isDone ? 600 : 500,
                          color: isCurrent ? 'var(--eco-dark)' : isDone ? 'var(--text-primary)' : 'var(--text-muted)'
                        }}
                      >
                        {stage.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Two-Column Grid: Left Metadata & Right Chain of Custody */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) 1fr', gap: '24px', alignItems: 'start' }}>
            {/* Left Column: Details, Weights, Proof */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Pickup & Party Overview */}
              <div className="content-card">
                <div className="content-card-header">
                  <h3>
                    <User size={16} />
                    <span>Origin & Stakeholders</span>
                  </h3>
                </div>
                <div className="content-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div className="cert-field-label">Generator</div>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginTop: '2px' }}>
                      {currentReq.userName}
                    </div>
                    {currentReq.organizationName && (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {currentReq.organizationName} (Institutional Generator)
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="cert-field-label">Pickup Location</div>
                    <div style={{ fontSize: '13px', marginTop: '2px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0, color: 'var(--text-muted)' }} />
                      <span>{currentReq.address.line1}, {currentReq.address.area}, {currentReq.address.city} - {currentReq.address.pincode}</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <div className="cert-field-label">Preferred Date</div>
                      <div style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>{currentReq.preferredDate}</div>
                    </div>
                    <div>
                      <div className="cert-field-label">Time Slot</div>
                      <div style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>{currentReq.preferredTimeSlot}</div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                    <div className="cert-field-label">Assigned Collector</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {currentReq.assignedCollectorName || 'Awaiting assignment'}
                    </div>
                  </div>

                  <div>
                    <div className="cert-field-label">Recycler Destination</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {currentReq.assignedRecyclerName || 'MahaRecycle Facility (Bhosari MIDC)'}
                    </div>
                    {currentReq.recyclerBatchId && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                        Batch Manifest: {currentReq.recyclerBatchId}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Weight Verification & Discrepancy Card */}
              <div className="content-card">
                <div className="content-card-header">
                  <h3>
                    <Scale size={16} />
                    <span>Weight Verification & Discrepancy</span>
                  </h3>
                </div>
                <div className="content-card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Estimated by User
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                        {currentReq.estimatedTotalWeightKg} <span style={{ fontSize: '13px', fontWeight: 500 }}>kg</span>
                      </div>
                    </div>

                    <div style={{ padding: '12px', background: currentReq.actualCollectedWeightKg ? 'var(--eco-subtle)' : 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: currentReq.actualCollectedWeightKg ? '1px solid var(--eco-border)' : '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '11px', color: currentReq.actualCollectedWeightKg ? 'var(--eco-dark)' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Actual Collected
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: currentReq.actualCollectedWeightKg ? 'var(--eco-primary)' : 'var(--text-muted)', marginTop: '4px' }}>
                        {currentReq.actualCollectedWeightKg ? `${currentReq.actualCollectedWeightKg} kg` : 'Pending Scale'}
                      </div>
                    </div>
                  </div>

                  {currentReq.actualCollectedWeightKg && Math.abs(currentReq.actualCollectedWeightKg - currentReq.estimatedTotalWeightKg) > 0.1 && (
                    <div className="discrepancy-callout" style={{ margin: '8px 0 14px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <AlertTriangle size={15} />
                        <span>Weight Variance Recorded</span>
                      </div>
                      <p style={{ marginTop: '4px', fontSize: '12px', lineHeight: 1.4 }}>
                        Deviation of {(currentReq.actualCollectedWeightKg - currentReq.estimatedTotalWeightKg > 0 ? '+' : '')}
                        {(currentReq.actualCollectedWeightKg - currentReq.estimatedTotalWeightKg).toFixed(1)} kg between initial estimate and certified field scale.
                        {currentReq.verificationProof?.discrepancyReason && (
                          <span style={{ display: 'block', marginTop: '3px' }}>
                            <strong>Note:</strong> {currentReq.verificationProof.discrepancyReason}
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Verification Proof Photos */}
                  {currentReq.verificationProof && currentReq.verificationProof.photos.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <div className="cert-field-label" style={{ marginBottom: '8px' }}>Field Verification Photos</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {currentReq.verificationProof.photos.map((photo, i) => (
                          <a key={i} href={photo} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
                            <img
                              src={photo}
                              alt="E-waste collection proof"
                              style={{ width: '88px', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-light)' }}
                            />
                          </a>
                        ))}
                      </div>
                      {currentReq.verificationProof.collectorNotes && (
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', fontStyle: 'italic' }}>
                          "{currentReq.verificationProof.collectorNotes}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Itemized Manifest */}
              <div className="content-card">
                <div className="content-card-header">
                  <h3>
                    <Layers size={16} />
                    <span>Registered Items ({currentReq.items.length})</span>
                  </h3>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Condition</th>
                        <th>Est. Wt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentReq.items.map(item => (
                        <tr key={item.id}>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.subCategory}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.category}</div>
                          </td>
                          <td><strong>{item.quantity}</strong></td>
                          <td>
                            <span style={{ fontSize: '11px', padding: '2px 6px', background: 'var(--bg-subtle)', borderRadius: '3px' }}>
                              {item.condition}
                            </span>
                          </td>
                          <td>{item.estimatedWeightKg ? `${item.estimatedWeightKg} kg` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Custody Timeline */}
            <div>
              <div className="content-card">
                <div className="content-card-header">
                  <h3>
                    <Calendar size={16} />
                    <span>Verifiable Custody Audit Trail</span>
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {currentReq.timeline.length} Events Verified
                  </span>
                </div>
                <div className="content-card-body" style={{ padding: '24px' }}>
                  <Timeline events={currentReq.timeline} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="content-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No request selected. Please enter a valid ID.</p>
        </div>
      )}
    </div>
  );
};

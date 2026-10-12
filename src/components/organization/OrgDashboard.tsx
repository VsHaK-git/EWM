import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrgAsset, EWasteCategory } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Building2,
  Package,
  Layers,
  FileCheck2,
  Scale,
  Plus,
  Calendar,
  CheckCircle2,
  Trash2,
  CheckSquare,
  Square,
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';

export const OrgDashboard: React.FC = () => {
  const {
    orgAssets,
    addOrgAsset,
    updateOrgAssetStatus,
    scheduleBulkAssetPickup,
    pickupRequests,
    certificates,
    setSelectedCertificate,
    setSelectedTrackingRequest,
    setActiveTab,
    showToast
  } = useApp();

  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // New Asset Form State
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState<EWasteCategory>('Computing');
  const [assetDept, setAssetDept] = useState('Computer Science Lab 1');
  const [assetSerial, setAssetSerial] = useState('');
  const [assetYear, setAssetYear] = useState(2018);
  const [assetCondition, setAssetCondition] = useState<'Working' | 'Non-working' | 'Damaged' | 'Obsolete'>('Obsolete');
  const [assetWeight, setAssetWeight] = useState(3.5);

  // Bulk Schedule Form State
  const [bulkDate, setBulkDate] = useState('2026-10-14');
  const [bulkSlot, setBulkSlot] = useState('11:00 AM – 2:00 PM');

  const orgPickups = pickupRequests.filter(r => r.userType === 'organization');

  const toggleSelectAsset = (id: string) => {
    setSelectedAssetIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllPending = () => {
    const pendingIds = orgAssets.filter(a => a.disposalStatus === 'Pending').map(a => a.id);
    setSelectedAssetIds(pendingIds);
  };

  const clearSelection = () => setSelectedAssetIds([]);

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;

    addOrgAsset({
      name: assetName,
      category: assetCategory,
      department: assetDept,
      serialNumber: assetSerial || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      purchaseYear: assetYear,
      condition: assetCondition,
      disposalStatus: 'Pending',
      estimatedWeightKg: Number(assetWeight)
    });

    setAssetName('');
    setAssetSerial('');
    setIsAddAssetOpen(false);
  };

  const handleBulkScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAssetIds.length === 0) return;

    const newReq = scheduleBulkAssetPickup(selectedAssetIds, bulkDate, bulkSlot);
    setSelectedAssetIds([]);
    setIsScheduleModalOpen(false);
    setSelectedTrackingRequest(newReq);
    showToast(`Bulk pickup scheduled for ${selectedAssetIds.length} assets (#${newReq.id})`, 'success');
  };

  const selectedTotalWeight = orgAssets
    .filter(a => selectedAssetIds.includes(a.id))
    .reduce((sum, a) => sum + (a.estimatedWeightKg || 3), 0);

  // Department distribution
  const deptCounts = orgAssets.reduce((acc, a) => {
    acc[a.department] = (acc[a.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      {/* Top Header */}
      <div className="page-header-row">
        <div className="page-header-titles">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2>DY Patil Engineering College, Akurdi</h2>
            <span style={{ fontSize: '11px', background: 'var(--eco-subtle)', border: '1px solid var(--eco-border)', color: 'var(--eco-dark)', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>
              Institutional Account #ORG-MH-4011
            </span>
          </div>
          <p>Centralized IT asset lifecycle management, scheduled bulk disposal, and MPCB Form-6 compliance records.</p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-secondary" onClick={() => setIsAddAssetOpen(true)}>
            <Plus size={14} />
            <span>Add IT Asset</span>
          </button>
          <button
            className="btn btn-primary"
            disabled={selectedAssetIds.length === 0}
            onClick={() => setIsScheduleModalOpen(true)}
          >
            <Calendar size={14} />
            <span>Schedule Bulk Pickup ({selectedAssetIds.length} Selected)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats (PRD Section 13) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Total E-Waste Collected</span>
            <Scale size={16} color="var(--eco-primary)" />
          </div>
          <div className="kpi-card-value">1,284 <span style={{ fontSize: '14px', fontWeight: 500 }}>kg</span></div>
          <div className="kpi-card-subtitle">+248.6 kg this academic quarter</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Items Registered</span>
            <Layers size={16} color="#4f46e5" />
          </div>
          <div className="kpi-card-value">2,846</div>
          <div className="kpi-card-subtitle">Across 6 college departments</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Completed Pickups</span>
            <CheckCircle2 size={16} color="#059669" />
          </div>
          <div className="kpi-card-value">74</div>
          <div className="kpi-card-subtitle">100% verified weighbridge manifests</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Recycling Batches</span>
            <FileCheck2 size={16} color="#c2410c" />
          </div>
          <div className="kpi-card-value">21</div>
          <div className="kpi-card-subtitle">Certified at MahaRecycle MIDC</div>
        </div>
      </div>

      {/* Monthly Collection Trend & Department Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="content-card" style={{ marginBottom: 0 }}>
          <div className="content-card-header">
            <h3>
              <Calendar size={16} />
              <span>Monthly Disposal Generation (kg)</span>
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Academic Year 2026</span>
          </div>
          <div className="content-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { month: 'Jan', kg: 140, bar: 65 },
                { month: 'Feb', kg: 195, bar: 85 },
                { month: 'Mar', kg: 95, bar: 42 },
                { month: 'Apr', kg: 260, bar: 100 },
                { month: 'May', kg: 210, bar: 88 },
                { month: 'Jun', kg: 120, bar: 50 },
                { month: 'Jul', kg: 85, bar: 38 },
                { month: 'Aug', kg: 175, bar: 74 },
                { month: 'Sep', kg: 248.6, bar: 96 }
              ].map(m => (
                <div key={m.month} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
                  <span style={{ width: '32px', fontWeight: 600, color: 'var(--text-secondary)' }}>{m.month}</span>
                  <div style={{ flex: 1, background: '#f1f5f9', height: '14px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${m.bar}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #15803d, #22c55e)',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  <span style={{ width: '65px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {m.kg} kg
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="content-card" style={{ marginBottom: 0 }}>
          <div className="content-card-header">
            <h3>
              <Building2 size={16} />
              <span>Department Assets</span>
            </h3>
          </div>
          <div className="content-card-body" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(deptCounts).map(([dept, count]) => (
                <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{dept}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Registered hardware assets</div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--eco-primary)', fontFamily: 'var(--font-mono)' }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* IT Asset Inventory (PRD Section 14) */}
      <div className="content-card">
        <div className="content-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3>
              <Package size={16} />
              <span>Institutional E-Waste Inventory</span>
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              ({orgAssets.length} tracked items)
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={selectAllPending}>
              Select All Pending ({orgAssets.filter(a => a.disposalStatus === 'Pending').length})
            </button>
            {selectedAssetIds.length > 0 && (
              <button className="btn btn-secondary btn-sm" onClick={clearSelection}>
                Clear Selection
              </button>
            )}
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>Select</th>
                <th>Asset ID</th>
                <th>Hardware Description</th>
                <th>Department</th>
                <th>Serial Number</th>
                <th>Year</th>
                <th>Condition</th>
                <th>Disposal Status</th>
                <th>Est. Wt</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orgAssets.map(asset => {
                const isSelected = selectedAssetIds.includes(asset.id);
                const canSelect = asset.disposalStatus === 'Pending';
                return (
                  <tr key={asset.id} style={{ background: isSelected ? 'var(--eco-subtle)' : undefined }}>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => canSelect && toggleSelectAsset(asset.id)}
                        disabled={!canSelect}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: canSelect ? 'pointer' : 'not-allowed',
                          color: isSelected ? 'var(--eco-primary)' : 'var(--text-muted)'
                        }}
                      >
                        {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    </td>
                    <td>
                      <span className="id-tag">{asset.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{asset.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{asset.category}</div>
                    </td>
                    <td>{asset.department}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{asset.serialNumber}</span>
                    </td>
                    <td>{asset.purchaseYear}</td>
                    <td>
                      <span style={{ fontSize: '11px', padding: '2px 6px', background: 'var(--bg-subtle)', borderRadius: '3px' }}>
                        {asset.condition}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background:
                            asset.disposalStatus === 'Recycled'
                              ? '#dcfce7'
                              : asset.disposalStatus === 'Scheduled'
                              ? '#e0e7ff'
                              : '#fef3c7',
                          color:
                            asset.disposalStatus === 'Recycled'
                              ? '#15803d'
                              : asset.disposalStatus === 'Scheduled'
                              ? '#4338ca'
                              : '#b45309'
                        }}
                      >
                        {asset.disposalStatus}
                      </span>
                    </td>
                    <td>{asset.estimatedWeightKg} kg</td>
                    <td>
                      {asset.disposalStatus === 'Pending' ? (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedAssetIds([asset.id]);
                            setIsScheduleModalOpen(true);
                          }}
                        >
                          Schedule
                        </button>
                      ) : asset.assignedRequestId ? (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            const req = pickupRequests.find(r => r.id === asset.assignedRequestId);
                            if (req) {
                              setSelectedTrackingRequest(req);
                              setActiveTab('tracking');
                            }
                          }}
                        >
                          Manifest
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Form-6 Certificates Table (PRD Section 15) */}
      <div className="content-card">
        <div className="content-card-header">
          <h3>
            <FileCheck2 size={16} />
            <span>Official Form-6 Recycling Certificates</span>
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Audit-ready compliance documents under E-Waste Rules 2022
          </span>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Certificate ID</th>
                <th>Request / Batch</th>
                <th>Certified Weight</th>
                <th>Material Description</th>
                <th>Recycler Facility</th>
                <th>Issue Date</th>
                <th>Regulatory Verification</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map(cert => (
                <tr key={cert.id}>
                  <td>
                    <span className="id-tag" onClick={() => setSelectedCertificate(cert)}>
                      {cert.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{cert.requestId}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Batch: {cert.batchId}</div>
                  </td>
                  <td>
                    <strong>{cert.totalWeightKg} kg</strong>
                  </td>
                  <td style={{ maxWidth: '280px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {cert.materialSummary}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{cert.recyclerName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CPCB: {cert.cpcbLicenseNumber}</div>
                  </td>
                  <td>{cert.issueDate}</td>
                  <td>
                    <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      ✓ Verified CPCB
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSelectedCertificate(cert)}
                    >
                      <Download size={12} />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Modal */}
      {isAddAssetOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Register New IT / Lab Asset</h3>
              <button className="modal-close-btn" onClick={() => setIsAddAssetOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCreateAsset}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Asset Name / Model <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dell Latitude 5420 Laptop"
                    value={assetName}
                    onChange={e => setAssetName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={assetCategory}
                      onChange={e => setAssetCategory(e.target.value as EWasteCategory)}
                    >
                      <option value="Computing">Computing</option>
                      <option value="Mobile & Communication">Mobile & Communication</option>
                      <option value="Consumer Electronics">Consumer Electronics</option>
                      <option value="Electrical/Electronic Accessories">Electrical / Lab Accessories</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      value={assetDept}
                      onChange={e => setAssetDept(e.target.value)}
                    >
                      <option value="Computer Science Lab 1">Computer Science Lab 1</option>
                      <option value="Computer Science Lab 3">Computer Science Lab 3</option>
                      <option value="Mechanical CAD Lab">Mechanical CAD Lab</option>
                      <option value="Electronics & Telecomm Lab">Electronics & Telecomm Lab</option>
                      <option value="Administrative Accounts">Administrative Accounts</option>
                      <option value="Server Room / IT Cell">Server Room / IT Cell</option>
                      <option value="Library Computer Center">Library Computer Center</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Serial / Service Tag</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. CN-0M354K-70166"
                      value={assetSerial}
                      onChange={e => setAssetSerial(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Purchase Year</label>
                    <input
                      type="number"
                      className="form-input"
                      value={assetYear}
                      onChange={e => setAssetYear(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Condition</label>
                    <select
                      className="form-select"
                      value={assetCondition}
                      onChange={e => setAssetCondition(e.target.value as any)}
                    >
                      <option value="Obsolete">Obsolete</option>
                      <option value="Non-working">Non-working</option>
                      <option value="Damaged">Damaged</option>
                      <option value="Working">Working</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estimated Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      className="form-input"
                      value={assetWeight}
                      onChange={e => setAssetWeight(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddAssetOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Bulk Pickup Modal */}
      {isScheduleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Schedule Bulk Institutional Pickup</h3>
              <button className="modal-close-btn" onClick={() => setIsScheduleModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleBulkScheduleSubmit}>
              <div className="modal-body">
                <div style={{ padding: '12px 16px', background: 'var(--eco-subtle)', border: '1px solid var(--eco-border)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--eco-dark)' }}>
                    Bulk Manifest Batch Summary
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Selected Assets: <strong>{selectedAssetIds.length} items</strong> | Estimated Batch Weight: <strong>~{selectedTotalWeight.toFixed(1)} kg</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Collection Pickup Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value="DY Patil Engineering College, Central Stores & Computer Center, Sector 29, Akurdi, Pune - 411044"
                    disabled
                  />
                  <div className="form-hint">Designated institutional loading dock with commercial vehicle ramp.</div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Preferred Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={bulkDate}
                      onChange={e => setBulkDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Time Window</label>
                    <select
                      className="form-select"
                      value={bulkSlot}
                      onChange={e => setBulkSlot(e.target.value)}
                    >
                      <option value="10:00 AM – 1:00 PM">10:00 AM – 1:00 PM (Morning Slot)</option>
                      <option value="1:00 PM – 4:00 PM">1:00 PM – 4:00 PM (Afternoon Slot)</option>
                      <option value="4:00 PM – 7:00 PM">4:00 PM – 7:00 PM (Evening Slot)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsScheduleModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Dispatch Request (~{selectedTotalWeight.toFixed(1)} kg)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

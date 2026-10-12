import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PickupRequest, OperationalStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  ShieldCheck,
  Truck,
  Building,
  Factory,
  CheckCircle,
  AlertCircle,
  FileCheck2,
  Users,
  Search,
  Filter,
  UserCheck,
  Scale
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    pickupRequests,
    partners,
    updateRequestStatus,
    setSelectedTrackingRequest,
    setActiveTab,
    showToast
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'queue' | 'partners' | 'audit'>('queue');

  // Filter requests
  const filteredRequests = pickupRequests.filter(req => {
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchesSearch =
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.address.area.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleQuickAssign = (req: PickupRequest) => {
    updateRequestStatus(req.id, 'ASSIGNED', {
      title: 'Collection Partner Assigned',
      description: 'Assigned to GreenLogix Logistics (Sachin More) for route pickup.',
      responsibleParty: 'State Operations Dispatch',
      role: 'System Administrator',
      location: 'Pune Central Ops'
    });
    showToast(`Assigned ${req.id} to GreenLogix Logistics`, 'success');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-header-titles">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2>State Operations Administration</h2>
            <span style={{ fontSize: '11px', background: '#e0e7ff', color: '#4338ca', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>
              Maharashtra Regional Control Hub
            </span>
          </div>
          <p>Operational oversight for Pune Metro, PCMC, logistics partner dispatch, and authorized recycler compliance.</p>
        </div>

        <div className="page-actions-group">
          <div className="role-switcher-container">
            <button
              className={`role-tab-btn ${activeAdminSubTab === 'queue' ? 'active' : ''}`}
              onClick={() => setActiveAdminSubTab('queue')}
            >
              Operations Queue
            </button>
            <button
              className={`role-tab-btn ${activeAdminSubTab === 'partners' ? 'active' : ''}`}
              onClick={() => setActiveAdminSubTab('partners')}
            >
              Partner Verification
            </button>
            <button
              className={`role-tab-btn ${activeAdminSubTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveAdminSubTab('audit')}
            >
              Audit Stream
            </button>
          </div>
        </div>
      </div>

      {/* Operational Metrics (PRD Section 17) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Open Pickup Requests</span>
            <AlertCircle size={16} color="#d97706" />
          </div>
          <div className="kpi-card-value">42</div>
          <div className="kpi-card-subtitle">Pending assignment / dispatch</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Today's Pickups</span>
            <Truck size={16} color="#2563eb" />
          </div>
          <div className="kpi-card-value">18</div>
          <div className="kpi-card-subtitle">Active on Pune routes</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Awaiting Recycler Intake</span>
            <Factory size={16} color="#6d28d9" />
          </div>
          <div className="kpi-card-value">7</div>
          <div className="kpi-card-subtitle">Batches in transit</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Processing Batches</span>
            <Building size={16} color="#059669" />
          </div>
          <div className="kpi-card-value">12</div>
          <div className="kpi-card-subtitle">At authorized recyclers</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Completed This Month</span>
            <CheckCircle size={16} color="var(--eco-primary)" />
          </div>
          <div className="kpi-card-value">184</div>
          <div className="kpi-card-subtitle">Certified & closed manifests</div>
        </div>
      </div>

      {/* TAB 1: OPERATIONS QUEUE */}
      {activeAdminSubTab === 'queue' && (
        <div className="content-card">
          <div className="content-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
              <h3>
                <Truck size={16} />
                <span>Pickup Operations Dispatch Queue</span>
              </h3>
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter by ID, name, area..."
                  className="form-input"
                  style={{ height: '32px', paddingLeft: '32px', fontSize: '12px' }}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="filter-pills">
              {['ALL', 'REQUESTED', 'SCHEDULED', 'ASSIGNED', 'COLLECTED', 'WEIGHT_DISCREPANCY'].map(st => (
                <button
                  key={st}
                  type="button"
                  className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
                  onClick={() => setStatusFilter(st)}
                >
                  {st === 'ALL' ? 'All Requests' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Generator Type</th>
                  <th>Contact & Location</th>
                  <th>Est. vs Actual</th>
                  <th>Date / Slot</th>
                  <th>Status</th>
                  <th>Assigned Partner</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(req => (
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
                      <div style={{ fontWeight: 600 }}>{req.userName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {req.userType === 'organization' ? req.organizationName : 'Individual Citizen'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{req.address.area}, Pune</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{req.contactPhone}</div>
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
                      <div style={{ fontSize: '12px' }}>{req.preferredDate}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{req.preferredTimeSlot}</div>
                    </td>
                    <td>
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td>
                      <div style={{ fontSize: '12px' }}>{req.assignedCollectorName || 'Unassigned'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {req.status === 'REQUESTED' || req.status === 'SCHEDULED' ? (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleQuickAssign(req)}
                          >
                            <UserCheck size={12} />
                            <span>Assign</span>
                          </button>
                        ) : null}

                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedTrackingRequest(req);
                            setActiveTab('tracking');
                          }}
                        >
                          Trace
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PARTNER MANAGEMENT (PRD Section 17) */}
      {activeAdminSubTab === 'partners' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="content-card">
            <div className="content-card-header">
              <h3>
                <Building size={16} />
                <span>Authorized Collection, Transport & Recycling Partners</span>
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Regulated under Maharashtra Pollution Control Board (MPCB)
              </span>
            </div>
            <div className="content-card-body" style={{ padding: 0 }}>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Organization</th>
                      <th>Partner Role</th>
                      <th>CPCB / MPCB Reg</th>
                      <th>Service Areas</th>
                      <th>Fleet / Facility</th>
                      <th>Total Handled</th>
                      <th>Compliance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.facilityAddress}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, padding: '2px 6px', background: 'var(--bg-subtle)', borderRadius: '4px' }}>
                            {p.type}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500 }}>
                            {p.cpcbAuthorizationNo}
                          </div>
                          <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600 }}>
                            MPCB: {p.mpcbStatus}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '12px', maxWidth: '240px' }}>
                            {p.serviceAreas.join(', ')}
                          </div>
                        </td>
                        <td>
                          {p.fleetSize ? (
                            <div>{p.fleetSize} Commercial Vehicles</div>
                          ) : (
                            <div>Industrial Recycling Plant</div>
                          )}
                        </td>
                        <td>
                          <strong>{p.totalCollectedOrProcessedKg.toLocaleString()} kg</strong>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                            ✓ {p.verificationStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT STREAM */}
      {activeAdminSubTab === 'audit' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>
              <ShieldCheck size={16} />
              <span>Real-Time Chain of Custody Audit Log</span>
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Cryptographically verified event sequence
            </span>
          </div>
          <div className="content-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pickupRequests.flatMap(r => r.timeline.map(e => ({ ...e, requestId: r.id }))).slice(0, 10).map((ev, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="id-tag">{ev.requestId}</span>
                      <strong style={{ fontSize: '13px' }}>{ev.title}</strong>
                      <StatusBadge status={ev.status} size="sm" />
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {ev.description}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Operator: {ev.responsibleParty} | Location: {ev.location}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(ev.timestamp).toLocaleTimeString('en-GB')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

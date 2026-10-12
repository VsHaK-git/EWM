import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RegisterEWasteModal } from './RegisterEWasteModal';
import { StatusBadge } from '../common/StatusBadge';
import {
  Plus,
  Truck,
  MapPin,
  Calendar,
  CheckCircle,
  FileCheck2,
  Scale,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const {
    pickupRequests,
    certificates,
    setSelectedTrackingRequest,
    setActiveTab,
    setSelectedCertificate,
    isNewRequestOpen,
    setIsNewRequestOpen
  } = useApp();

  const userPickups = pickupRequests.filter(r => r.userType === 'individual');

  const totalKgRecycled = userPickups
    .filter(r => r.status === 'COLLECTED' || r.status === 'RECEIVED_BY_RECYCLER' || r.status === 'PROCESSING_COMPLETED' || r.status === 'CERTIFICATE_ISSUED')
    .reduce((sum, r) => sum + (r.actualCollectedWeightKg || r.estimatedTotalWeightKg || 0), 0);

  const activeCount = userPickups.filter(
    r => r.status !== 'PROCESSING_COMPLETED' && r.status !== 'CERTIFICATE_ISSUED' && r.status !== 'CANCELLED'
  ).length;

  const handleTrackRequest = (id: string) => {
    const req = pickupRequests.find(r => r.id === id);
    if (req) {
      setSelectedTrackingRequest(req);
      setActiveTab('tracking');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-header-titles">
          <h2>Citizen Disposal Portal</h2>
          <p>Schedule door-step e-waste collection, verify pickup scale weights, and track recycling compliance.</p>
        </div>
        <div className="page-actions-group">
          <button className="btn btn-primary" onClick={() => setIsNewRequestOpen(true)}>
            <Plus size={15} />
            <span>Schedule Doorstep Pickup</span>
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('centres')}>
            <MapPin size={15} color="var(--eco-primary)" />
            <span>Find Drop-off Hubs</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Diverted From Landfills</span>
            <Scale size={16} color="var(--eco-primary)" />
          </div>
          <div className="kpi-card-value">{totalKgRecycled.toFixed(1)} <span style={{ fontSize: '14px', fontWeight: 500 }}>kg</span></div>
          <div className="kpi-card-subtitle">Verified on certified scale</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Active Pickups</span>
            <Truck size={16} color="#2563eb" />
          </div>
          <div className="kpi-card-value">{activeCount}</div>
          <div className="kpi-card-subtitle">Assigned / In transit in Pune</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Total Requests</span>
            <Clock size={16} color="#64748b" />
          </div>
          <div className="kpi-card-value">{userPickups.length}</div>
          <div className="kpi-card-subtitle">Doorstep & Drop-off records</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Recycling Records</span>
            <FileCheck2 size={16} color="#059669" />
          </div>
          <div className="kpi-card-value">{certificates.length}</div>
          <div className="kpi-card-subtitle">Digitally signed certificates</div>
        </div>
      </div>

      {/* Active & Scheduled Pickups */}
      <div className="content-card">
        <div className="content-card-header">
          <h3>
            <Truck size={16} />
            <span>My E-Waste Collection Requests</span>
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing {userPickups.length} requests
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Pickup Area</th>
                <th>Items & Category</th>
                <th>Est. vs Actual Wt</th>
                <th>Preferred Slot</th>
                <th>Status</th>
                <th>Partner / Collector</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userPickups.map(req => (
                <tr key={req.id}>
                  <td>
                    <span className="id-tag" onClick={() => handleTrackRequest(req.id)}>
                      {req.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{req.address.area}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{req.address.line1}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>
                      {req.items.slice(0, 2).map(i => `${i.quantity}x ${i.subCategory}`).join(', ')}
                      {req.items.length > 2 && <span style={{ color: 'var(--text-muted)' }}> +{req.items.length - 2} more</span>}
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
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{req.preferredDate}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{req.preferredTimeSlot}</div>
                  </td>
                  <td>
                    <StatusBadge status={req.status} size="sm" />
                  </td>
                  <td>
                    <div style={{ fontSize: '12px' }}>{req.assignedCollectorName || 'Pending Assignment'}</div>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleTrackRequest(req.id)}
                    >
                      <span>Track</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Civic Drop-Off Information Box */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        <div className="content-card">
          <div className="content-card-header">
            <h3>
              <ShieldCheck size={16} color="var(--eco-primary)" />
              <span>Responsible Recycling Guarantee</span>
            </h3>
          </div>
          <div className="content-card-body" style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <p>
              Unlike the informal sector where e-waste is burned in open acid baths releasing toxic lead, cadmium, and mercury into Pune’s groundwater, every pickup scheduled on EcoCycle is routed through <strong>MPCB-authorized recyclers</strong> equipped with scientific shredding and metal extraction filters.
            </p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '16px' }}>
              <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Rule Compliance</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Complies with India E-Waste Rules 2022</div>
              </div>
              <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Digital Trace</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Every kg matched with serial scale logs</div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="content-card-header">
            <h3>
              <FileCheck2 size={16} />
              <span>Recent Recycling Certificates</span>
            </h3>
          </div>
          <div className="content-card-body" style={{ padding: '14px 20px' }}>
            {certificates.slice(0, 2).map(cert => (
              <div
                key={cert.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border-light)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>{cert.id}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {cert.totalWeightKg} kg | Issued: {cert.issueDate}
                  </div>
                </div>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setSelectedCertificate(cert)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Request Modal */}
      <RegisterEWasteModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
      />
    </div>
  );
};

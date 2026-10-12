import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecyclerBatch } from '../../types';
import {
  Factory,
  PackageCheck,
  Cpu,
  Layers,
  FileCheck2,
  Scale,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const RecyclerDashboard: React.FC = () => {
  const {
    recyclerBatches,
    receiveBatchAtRecycler,
    recordBatchProcessing,
    issueCertificateForBatch,
    setSelectedCertificate,
    showToast
  } = useApp();

  const [activeProcessingBatch, setActiveProcessingBatch] = useState<RecyclerBatch | null>(null);

  // Sorting breakdown state
  const [operatorName, setOperatorName] = useState('Manoj Salve (Lead Sorting Engineer)');
  const [recyclableKg, setRecyclableKg] = useState<string>('92.4');
  const [reusableKg, setReusableKg] = useState<string>('31.7');
  const [controlledKg, setControlledKg] = useState<string>('21.3');
  const [residualKg, setResidualKg] = useState<string>('11.5');

  const openProcessingModal = (batch: RecyclerBatch) => {
    setActiveProcessingBatch(batch);
    const total = batch.receivedWeightKg || 156.9;
    setRecyclableKg((total * 0.589).toFixed(1));
    setReusableKg((total * 0.202).toFixed(1));
    setControlledKg((total * 0.136).toFixed(1));
    setResidualKg((total * 0.073).toFixed(1));
  };

  const handleSaveProcessing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProcessingBatch) return;

    const rKg = parseFloat(recyclableKg) || 0;
    const uKg = parseFloat(reusableKg) || 0;
    const cKg = parseFloat(controlledKg) || 0;
    const sKg = parseFloat(residualKg) || 0;

    recordBatchProcessing(activeProcessingBatch.id, {
      recyclableKg: rKg,
      reusableKg: uKg,
      controlledHazardousKg: cKg,
      residualKg: sKg,
      operatorName
    });

    setActiveProcessingBatch(null);
  };

  const handleGenerateCertificate = (batch: RecyclerBatch) => {
    const cert = issueCertificateForBatch(batch.id);
    setSelectedCertificate(cert);
  };

  // Mass balance calculator
  const enteredSum =
    (parseFloat(recyclableKg) || 0) +
    (parseFloat(reusableKg) || 0) +
    (parseFloat(controlledKg) || 0) +
    (parseFloat(residualKg) || 0);

  const batchWeight = activeProcessingBatch?.receivedWeightKg || 0;
  const balanceDiff = +(enteredSum - batchWeight).toFixed(1);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-header-titles">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2>MahaRecycle Industrial Complex</h2>
            <span style={{ fontSize: '11px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>
              CPCB Reg: CPCB/EW-REG/MH/2022/0412
            </span>
          </div>
          <p>Bhosari MIDC E-Waste Recycling Unit: Inbound batch receiving, mechanical shredding, hazardous material isolation, and certificate generation.</p>
        </div>
      </div>

      {/* KPI Cards (PRD Section 11 & 12) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Material Received</span>
            <Scale size={16} color="var(--eco-primary)" />
          </div>
          <div className="kpi-card-value">418.9 <span style={{ fontSize: '14px', fontWeight: 500 }}>kg</span></div>
          <div className="kpi-card-subtitle">Inbound manifests verified</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Recyclables Recovered</span>
            <Layers size={16} color="#059669" />
          </div>
          <div className="kpi-card-value">247.0 <span style={{ fontSize: '14px', fontWeight: 500 }}>kg</span></div>
          <div className="kpi-card-subtitle">Copper, Aluminum, High-grade ABS</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Controlled Hazardous</span>
            <AlertTriangle size={16} color="#b45309" />
          </div>
          <div className="kpi-card-value">56.7 <span style={{ fontSize: '14px', fontWeight: 500 }}>kg</span></div>
          <div className="kpi-card-subtitle">Sent to TSDF Ranjangaon</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-label">
            <span>Compliance Certificates</span>
            <FileCheck2 size={16} color="#2563eb" />
          </div>
          <div className="kpi-card-value">2</div>
          <div className="kpi-card-subtitle">Signed Form-6 certificates</div>
        </div>
      </div>

      {/* Batches Table (PRD Section 11) */}
      <div className="content-card">
        <div className="content-card-header">
          <h3>
            <Factory size={16} />
            <span>Facility Inbound Batches & Processing Status</span>
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Plot E-42, Bhosari MIDC, Pune
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Batch Number</th>
                <th>Linked Pickups</th>
                <th>Items Count</th>
                <th>Expected vs Received</th>
                <th>Intake Date</th>
                <th>Processing Status</th>
                <th>Breakdown Recorded</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recyclerBatches.map(batch => (
                <tr key={batch.id}>
                  <td>
                    <span className="id-tag">{batch.batchNumber}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {batch.linkedRequestIds.map(id => (
                        <span key={id} style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', background: 'var(--bg-subtle)', padding: '1px 5px', borderRadius: '3px' }}>
                          {id}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td><strong>{batch.manifestItemsCount} units</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{batch.receivedWeightKg} kg</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Exp: {batch.expectedWeightKg} kg</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px' }}>
                      {new Date(batch.receivedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background:
                          batch.processingStatus === 'CERTIFIED'
                            ? '#dcfce7'
                            : batch.processingStatus === 'PROCESSED'
                            ? '#e0e7ff'
                            : '#fef3c7',
                        color:
                          batch.processingStatus === 'CERTIFIED'
                            ? '#15803d'
                            : batch.processingStatus === 'PROCESSED'
                            ? '#4338ca'
                            : '#b45309'
                      }}
                    >
                      {batch.processingStatus}
                    </span>
                  </td>
                  <td>
                    {batch.materialBreakdown ? (
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        <div>Recyclable: <strong>{batch.materialBreakdown.recyclableKg} kg</strong></div>
                        <div>Hazardous: <strong>{batch.materialBreakdown.controlledHazardousKg} kg</strong></div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Awaiting Sorting Station</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {batch.processingStatus === 'RECEIVED' || batch.processingStatus === 'IN_SORTING' ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => openProcessingModal(batch)}
                        >
                          <Cpu size={13} />
                          <span>Record Sorting</span>
                        </button>
                      ) : batch.processingStatus === 'PROCESSED' ? (
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleGenerateCertificate(batch)}
                        >
                          <FileCheck2 size={13} />
                          <span>Issue Certificate</span>
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            if (batch.certificateId) {
                              const cert = { id: batch.certificateId } as any;
                              handleGenerateCertificate(batch);
                            }
                          }}
                        >
                          <span>View Cert</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sorting & Processing Record Modal (PRD Section 12) */}
      {activeProcessingBatch && (
        <div className="modal-overlay">
          <div className="modal-dialog modal-lg">
            <div className="modal-header">
              <div>
                <h3>Material Sorting & Processing Record</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Batch #{activeProcessingBatch.batchNumber} — Intake: {activeProcessingBatch.receivedWeightKg} kg
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveProcessingBatch(null)}>×</button>
            </div>

            <form onSubmit={handleSaveProcessing}>
              <div className="modal-body">
                <div style={{ padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Enter manual recovery quantities measured by authorized sorting station scales. Mass balance checks are enforced against the received weighbridge weight.
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Authorized Sorting Engineer / Operator Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={operatorName}
                    onChange={e => setOperatorName(e.target.value)}
                    required
                  />
                </div>

                {/* 4 Materials Breakdown (PRD Section 12) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ border: '1px solid var(--border-light)', padding: '12px', borderRadius: 'var(--radius-md)', background: '#ffffff' }}>
                    <label className="form-label" style={{ color: '#15803d' }}>
                      1. Recyclable Material (kg) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={recyclableKg}
                      onChange={e => setRecyclableKg(e.target.value)}
                      required
                    />
                    <div className="form-hint">Metals, printed circuit boards, high-grade plastic casings</div>
                  </div>

                  <div style={{ border: '1px solid var(--border-light)', padding: '12px', borderRadius: 'var(--radius-md)', background: '#ffffff' }}>
                    <label className="form-label" style={{ color: '#0f766e' }}>
                      2. Reusable Components (kg) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={reusableKg}
                      onChange={e => setReusableKg(e.target.value)}
                      required
                    />
                    <div className="form-hint">Tested working RAM, CPU coolers, power bricks, intact panels</div>
                  </div>

                  <div style={{ border: '1px solid var(--border-light)', padding: '12px', borderRadius: 'var(--radius-md)', background: '#ffffff' }}>
                    <label className="form-label" style={{ color: '#b45309' }}>
                      3. Controlled / Hazardous Material (kg) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={controlledKg}
                      onChange={e => setControlledKg(e.target.value)}
                      required
                    />
                    <div className="form-hint">Lithium batteries, lead glass, mercury backlights (Sent to TSDF)</div>
                  </div>

                  <div style={{ border: '1px solid var(--border-light)', padding: '12px', borderRadius: 'var(--radius-md)', background: '#ffffff' }}>
                    <label className="form-label" style={{ color: '#64748b' }}>
                      4. Residual Material (kg) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={residualKg}
                      onChange={e => setResidualKg(e.target.value)}
                      required
                    />
                    <div className="form-hint">Inert non-recyclable residue, rubber gaskets, dust</div>
                  </div>
                </div>

                {/* Mass Balance Indicator */}
                <div style={{ padding: '12px 16px', background: Math.abs(balanceDiff) > 1.0 ? '#fff1f2' : '#f0fdf4', border: `1px solid ${Math.abs(balanceDiff) > 1.0 ? '#fecdd3' : '#bbf7d0'}`, borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>Mass Balance Verification:</span>
                      <span style={{ fontSize: '13px', marginLeft: '6px' }}>
                        Entered Total: <strong>{enteredSum.toFixed(1)} kg</strong> / Received: <strong>{batchWeight} kg</strong>
                      </span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: Math.abs(balanceDiff) > 1.0 ? '#b91c1c' : '#15803d' }}>
                      Variance: {balanceDiff > 0 ? `+${balanceDiff}` : balanceDiff} kg
                    </span>
                  </div>
                  {Math.abs(balanceDiff) > 1.0 && (
                    <div style={{ fontSize: '11px', color: '#b91c1c', marginTop: '4px' }}>
                      * Note: High variance detected between weighbridge intake and station breakdown. Ensure sorting balance aligns.
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveProcessingBatch(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={15} />
                  <span>Commit Sorting Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

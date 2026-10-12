import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Download, Copy, CheckCircle, ShieldCheck } from 'lucide-react';

export const CertificateModal: React.FC = () => {
  const { selectedCertificate, setSelectedCertificate, showToast } = useApp();

  if (!selectedCertificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(selectedCertificate.qrPayload);
    showToast('Verification URL copied to clipboard', 'info');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-xl" style={{ maxWidth: '840px' }}>
        <div className="modal-header">
          <div>
            <h3>Certificate of Responsible Recycling</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Verifiable compliance document under India E-Waste (Management) Rules, 2022
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleCopyLink}>
              <Copy size={14} />
              <span>Copy Link</span>
            </button>
            <button className="modal-close-btn" onClick={() => setSelectedCertificate(null)}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ background: '#f8fafc', padding: '24px' }}>
          {/* Printable Official Document */}
          <div className="cert-document">
            {/* Header */}
            <div className="cert-header">
              <div className="sub-law">
                GOVERNMENT OF INDIA • MINISTRY OF ENVIRONMENT, FOREST & CLIMATE CHANGE
              </div>
              <h2>CERTIFICATE OF RESPONSIBLE RECYCLING & DISPOSAL</h2>
              <p>Issued pursuant to Rule 13 of the E-Waste (Management) Rules, 2022 (Form-6 Manifest Equivalent)</p>
              <div style={{ marginTop: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--eco-primary)' }}>
                MAHARASHTRA POLLUTION CONTROL BOARD (MPCB) AUTHORIZED RECYCLER
              </div>
            </div>

            {/* Certificate ID & Dates Grid */}
            <div className="cert-grid">
              <div>
                <div className="cert-field-label">Certificate Serial Number</div>
                <div className="cert-field-value" style={{ fontFamily: 'var(--font-mono)' }}>
                  {selectedCertificate.certificateNumber}
                </div>
              </div>

              <div>
                <div className="cert-field-label">Verification Code</div>
                <div className="cert-field-value" style={{ fontFamily: 'var(--font-mono)' }}>
                  {selectedCertificate.verificationCode}
                </div>
              </div>

              <div>
                <div className="cert-field-label">E-Waste Generator (Institution / Citizen)</div>
                <div className="cert-field-value">{selectedCertificate.organizationName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {selectedCertificate.generatorAddress}
                </div>
              </div>

              <div>
                <div className="cert-field-label">Authorized Recycling Facility</div>
                <div className="cert-field-value">{selectedCertificate.recyclerName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {selectedCertificate.recyclerFacility}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  CPCB Reg: {selectedCertificate.cpcbLicenseNumber}
                </div>
              </div>

              <div>
                <div className="cert-field-label">Linked Collection Request</div>
                <div className="cert-field-value" style={{ fontFamily: 'var(--font-mono)' }}>
                  {selectedCertificate.requestId}
                </div>
              </div>

              <div>
                <div className="cert-field-label">Date of Issue</div>
                <div className="cert-field-value">{selectedCertificate.issueDate}</div>
              </div>
            </div>

            {/* Mass Balance Breakdown Table */}
            <div style={{ marginTop: '16px' }}>
              <div className="cert-field-label" style={{ marginBottom: '6px' }}>
                Audited Mass Balance & Material Recovery Breakdown
              </div>
              <table className="cert-table">
                <thead>
                  <tr>
                    <th>Material Fraction Recovered</th>
                    <th>Weight Recovered</th>
                    <th>% Fraction</th>
                    <th>Disposition / Destination</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Ferrous & Non-Ferrous Metals</strong> (Cu, Al, Fe)</td>
                    <td><strong>{selectedCertificate.breakdown.metalsKg} kg</strong></td>
                    <td>{((selectedCertificate.breakdown.metalsKg / selectedCertificate.totalWeightKg) * 100).toFixed(1)}%</td>
                    <td>Secondary Smelting & Refining (Authorized Foundry, Pune)</td>
                  </tr>
                  <tr>
                    <td><strong>Engineered Polymers & Plastics</strong> (ABS, Polycarbonate)</td>
                    <td><strong>{selectedCertificate.breakdown.plasticsKg} kg</strong></td>
                    <td>{((selectedCertificate.breakdown.plasticsKg / selectedCertificate.totalWeightKg) * 100).toFixed(1)}%</td>
                    <td>Pelletization & Granular Remanufacturing</td>
                  </tr>
                  <tr>
                    <td><strong>Printed Circuit Boards (PCBs)</strong></td>
                    <td><strong>{selectedCertificate.breakdown.circuitBoardsKg} kg</strong></td>
                    <td>{((selectedCertificate.breakdown.circuitBoardsKg / selectedCertificate.totalWeightKg) * 100).toFixed(1)}%</td>
                    <td>Precious Metal Recovery & Hydrometallurgical Extraction</td>
                  </tr>
                  <tr>
                    <td><strong>Controlled Hazardous Fractions</strong> (Pb, Hg, Lithium)</td>
                    <td><strong>{selectedCertificate.breakdown.hazardousSafelyTreatedKg} kg</strong></td>
                    <td>{((selectedCertificate.breakdown.hazardousSafelyTreatedKg / selectedCertificate.totalWeightKg) * 100).toFixed(1)}%</td>
                    <td>Safe Stabilization & Encapsulation at TSDF Ranjangaon</td>
                  </tr>
                  <tr>
                    <td><strong>Reusable Sub-assemblies</strong></td>
                    <td><strong>{selectedCertificate.breakdown.reusableExtractedKg} kg</strong></td>
                    <td>{((selectedCertificate.breakdown.reusableExtractedKg / selectedCertificate.totalWeightKg) * 100).toFixed(1)}%</td>
                    <td>Refurbishment Testing Protocol</td>
                  </tr>
                  <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                    <td>TOTAL CERTIFIED E-WASTE PROCESSED</td>
                    <td>{selectedCertificate.totalWeightKg} kg</td>
                    <td>100.0%</td>
                    <td>Zero Unsafe Landfill Disposal Confirmed</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Compliance Guarantee Declaration */}
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '16px' }}>
              <strong>Statutory Declaration:</strong> It is certified that the electronic waste material listed above has been transported, weighed, disassembled, and recycled in strict conformance with the standard operating procedures mandated by the Central Pollution Control Board (CPCB) and Maharashtra Pollution Control Board (MPCB). No component was routed to unorganized or unscientific scrap processors.
            </p>

            {/* Footer with QR Code and Authorized Stamp */}
            <div className="cert-footer-row">
              <div className="cert-qr-box">
                {/* Visual SVG QR Representation */}
                <svg className="cert-qr-code" viewBox="0 0 100 100">
                  <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                  {/* Outer position boxes */}
                  <rect x="8" y="8" width="28" height="28" fill="#0f172a" />
                  <rect x="12" y="12" width="20" height="20" fill="#ffffff" />
                  <rect x="16" y="16" width="12" height="12" fill="#0f172a" />

                  <rect x="64" y="8" width="28" height="28" fill="#0f172a" />
                  <rect x="68" y="12" width="20" height="20" fill="#ffffff" />
                  <rect x="72" y="16" width="12" height="12" fill="#0f172a" />

                  <rect x="8" y="64" width="28" height="28" fill="#0f172a" />
                  <rect x="12" y="68" width="20" height="20" fill="#ffffff" />
                  <rect x="16" y="72" width="12" height="12" fill="#0f172a" />

                  {/* Random QR bits */}
                  <rect x="42" y="12" width="8" height="8" fill="#0f172a" />
                  <rect x="48" y="24" width="8" height="8" fill="#0f172a" />
                  <rect x="42" y="42" width="16" height="16" fill="var(--eco-primary)" />
                  <rect x="14" y="44" width="8" height="8" fill="#0f172a" />
                  <rect x="26" y="48" width="8" height="8" fill="#0f172a" />
                  <rect x="64" y="48" width="12" height="8" fill="#0f172a" />
                  <rect x="80" y="44" width="8" height="16" fill="#0f172a" />
                  <rect x="44" y="68" width="8" height="16" fill="#0f172a" />
                  <rect x="58" y="74" width="16" height="8" fill="#0f172a" />
                  <rect x="80" y="70" width="12" height="12" fill="#0f172a" />
                </svg>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Digital QR Verification
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '240px' }}>
                    Scan to verify certificate authenticity on state e-waste registry.
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--eco-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    {selectedCertificate.verificationCode}
                  </div>
                </div>
              </div>

              <div className="cert-sign-box">
                <div className="cert-stamp">
                  ✓ CPCB VERIFIED • PROCESSED
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  {selectedCertificate.signatory.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {selectedCertificate.signatory.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {selectedCertificate.signatory.organization}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setSelectedCertificate(null)}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print Official Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

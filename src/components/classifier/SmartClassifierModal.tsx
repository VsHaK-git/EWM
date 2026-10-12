import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Camera, CheckCircle, Sparkles, UploadCloud, AlertCircle } from 'lucide-react';
import { EWasteCategory } from '../../types';

interface SampleImage {
  id: string;
  name: string;
  url: string;
  suggestedCategory: EWasteCategory;
  suggestedSubCategory: string;
  confidence: number;
  estWeight: number;
  notes: string;
}

const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'sample-laptop',
    name: 'Old Laptop (Dell Latitude)',
    url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80',
    suggestedCategory: 'Computing',
    suggestedSubCategory: 'Laptop',
    confidence: 91,
    estWeight: 2.2,
    notes: 'Li-ion battery detected. Recommend battery disconnect before bagging.'
  },
  {
    id: 'sample-crt',
    name: 'Damaged Monitor',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    suggestedCategory: 'Computing',
    suggestedSubCategory: 'Monitor',
    confidence: 94,
    estWeight: 4.1,
    notes: 'Lead phosphor glass casing. Requires controlled packaging.'
  },
  {
    id: 'sample-phones',
    name: 'Smartphones & Wall Chargers',
    url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80',
    suggestedCategory: 'Mobile & Communication',
    suggestedSubCategory: 'Mobile phone',
    confidence: 88,
    estWeight: 0.6,
    notes: 'Compact lithium cell; gold and copper traces recoverable from logic board.'
  },
  {
    id: 'sample-pcb',
    name: 'Server Power Supply / SMPS',
    url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
    suggestedCategory: 'Electrical/Electronic Accessories',
    suggestedSubCategory: 'Power supply',
    confidence: 86,
    estWeight: 1.8,
    notes: 'Heavy copper coils and aluminum heat sinks detected.'
  }
];

export const SmartClassifierModal: React.FC = () => {
  const { isClassifierOpen, setIsClassifierOpen, setIsNewRequestOpen, showToast } = useApp();
  const [selectedSample, setSelectedSample] = useState<SampleImage>(SAMPLE_IMAGES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  if (!isClassifierOpen) return null;

  const handleSelectSample = (sample: SampleImage) => {
    setIsAnalyzing(true);
    setSelectedSample(sample);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 400);
  };

  const handleConfirmClassification = () => {
    setIsClassifierOpen(false);
    setIsNewRequestOpen(true);
    showToast(
      `Classification accepted: ${selectedSample.suggestedSubCategory} (${selectedSample.confidence}% confidence)`,
      'success'
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-lg">
        <div className="modal-header">
          <div>
            <h3>Smart E-Waste Category Classifier</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Assisted identification for citizen and facility sorting (Human confirmation remains authoritative)
            </p>
          </div>
          <button className="modal-close-btn" onClick={() => setIsClassifierOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Sample images selector */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Select Sample Hardware Photo or Upload
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {SAMPLE_IMAGES.map(sample => {
                const isSelected = selectedSample.id === sample.id;
                return (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    style={{
                      border: `2px solid ${isSelected ? 'var(--eco-primary)' : 'var(--border-light)'}`,
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--eco-subtle)' : '#ffffff'
                    }}
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '6px 8px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sample.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Inference Result Card (PRD Section 23) */}
          <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '18px', background: '#fafbfc' }}>
            {isAnalyzing ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                Evaluating item geometry and component markings...
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '20px', alignItems: 'center' }}>
                <img
                  src={selectedSample.url}
                  alt={selectedSample.name}
                  style={{ width: '140px', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Possible Category:</span>
                    <strong style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                      {selectedSample.suggestedSubCategory}
                    </strong>
                    <span
                      style={{
                        fontSize: '11px',
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#047857',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      Confidence: {selectedSample.confidence}%
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Regulatory Group: <strong>{selectedSample.suggestedCategory}</strong> • Typical Unit Weight: <strong>~{selectedSample.estWeight} kg</strong>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', background: '#ffffff', border: '1px solid var(--border-light)', padding: '8px 12px', borderRadius: '4px' }}>
                    <strong>Environmental Note:</strong> {selectedSample.notes}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '16px', padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <AlertCircle size={16} color="var(--eco-primary)" style={{ flexShrink: 0 }} />
            <span>
              <strong>PRD Principle (Section 23):</strong> AI serves only as an assistive suggestion. The final declaration and verified weighbridge measurement remain authoritative.
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setIsClassifierOpen(false)}>
            Dismiss
          </button>
          <button className="btn btn-primary" onClick={handleConfirmClassification}>
            <CheckCircle size={15} />
            <span>Confirm & Add to Request Manifest</span>
          </button>
        </div>
      </div>
    </div>
  );
};

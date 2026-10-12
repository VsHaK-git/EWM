import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CollectionCentre, EWasteCategory } from '../../types';
import {
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  Building,
  Navigation,
  ShieldCheck,
  Search,
  Filter,
  Layers
} from 'lucide-react';

export const CollectionPointsView: React.FC = () => {
  const { collectionCentres, setIsNewRequestOpen, showToast } = useApp();
  const [selectedCentre, setSelectedCentre] = useState<CollectionCentre>(collectionCentres[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCentres = collectionCentres.filter(c => {
    const matchesCategory =
      categoryFilter === 'ALL' || c.acceptedCategories.includes(categoryFilter as EWasteCategory);
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.pincode.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-header-titles">
          <h2>Verified E-Waste Collection Centres — Pune & PCMC</h2>
          <p>Discover municipal and partner collection depots equipped with certified weighing balances and safe hazardous containment.</p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-primary" onClick={() => setIsNewRequestOpen(true)}>
            <Building size={14} />
            <span>Book Drop-off Slot</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ height: '36px', paddingLeft: '32px', fontSize: '13px' }}
            placeholder="Search Pune area, pincode, center..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          {['ALL', 'Computing', 'Mobile & Communication', 'Consumer Electronics', 'Electrical/Electronic Accessories'].map(cat => (
            <button
              key={cat}
              className={`filter-pill ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sidebar List + Interactive Map Canvas */}
      <div className="map-layout-grid">
        {/* Left Sidebar List */}
        <div className="map-sidebar">
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)', background: '#fafbfc' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {filteredCentres.length} Verified Depots in Pune
            </span>
          </div>

          <div className="map-sidebar-list">
            {filteredCentres.map(centre => {
              const isSelected = selectedCentre?.id === centre.id;
              return (
                <div
                  key={centre.id}
                  className={`map-card-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedCentre(centre)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="map-card-name">{centre.name}</div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '3px',
                        background: centre.isOpen ? '#ecfdf5' : '#f1f5f9',
                        color: centre.isOpen ? '#047857' : '#64748b'
                      }}
                    >
                      {centre.isOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>

                  <div className="map-card-area">{centre.area} • PIN {centre.pincode}</div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    <Clock size={12} />
                    <span>{centre.operatingHours}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <ShieldCheck size={12} color="var(--eco-primary)" />
                    <span>Partner: {centre.managedBy}</span>
                  </div>

                  {/* Capacity Bar */}
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>
                      <span>Bin Capacity</span>
                      <span>{centre.currentCapacityPercent}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${centre.currentCapacityPercent}%`,
                          height: '100%',
                          background: centre.currentCapacityPercent > 80 ? '#e11d48' : 'var(--eco-primary)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Details & Schematic Map Canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Schematic Pune Interactive Map */}
          <div className="map-canvas-container">
            <div style={{ padding: '12px 16px', background: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
                <Navigation size={14} color="var(--eco-primary)" />
                <span>Pune Metropolitan E-Waste Geo-Grid (Maharashtra)</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lat 18.5204° N, Long 73.8567° E</span>
            </div>

            {/* Visual SVG Map of Pune Regions */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <svg width="100%" height="280" viewBox="0 0 600 300" style={{ background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {/* Pune Rivers (Mula-Mutha) */}
                <path d="M 50 140 Q 200 120 300 150 T 550 130" fill="none" stroke="#bfdbfe" strokeWidth="12" strokeLinecap="round" />
                <text x="320" y="145" fontSize="10" fill="#93c5fd" fontFamily="var(--font-sans)">Mula-Mutha River Corridor</text>

                {/* Major Highways */}
                <path d="M 80 40 L 480 260" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 120 280 L 520 60" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

                {/* Centre Map Pins */}
                {filteredCentres.map((centre, idx) => {
                  const x = 90 + ((idx * 85) % 450);
                  const y = 60 + ((idx * 60) % 200);
                  const isSelected = selectedCentre?.id === centre.id;

                  return (
                    <g
                      key={centre.id}
                      onClick={() => setSelectedCentre(centre)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? '14' : '10'}
                        fill={isSelected ? 'var(--eco-primary)' : '#0f172a'}
                        stroke="#ffffff"
                        strokeWidth="3"
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                      />
                      <circle cx={x} cy={y} r="3" fill="#ffffff" />
                      <rect
                        x={x - 45}
                        y={y + 12}
                        width="90"
                        height="18"
                        rx="3"
                        fill={isSelected ? 'var(--eco-primary)' : '#ffffff'}
                        stroke={isSelected ? 'var(--eco-primary)' : '#cbd5e1'}
                        strokeWidth="1"
                      />
                      <text
                        x={x}
                        y={y + 24}
                        fontSize="9"
                        fontWeight="600"
                        textAnchor="middle"
                        fill={isSelected ? '#ffffff' : '#0f172a'}
                      >
                        {centre.area}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Selected Depot Detail Card (PRD Section 16) */}
          {selectedCentre && (
            <div className="content-card" style={{ marginBottom: 0 }}>
              <div className="content-card-body" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{selectedCentre.name}</h3>
                      <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        ✓ Verified Partner
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="var(--text-muted)" />
                      <span>{selectedCentre.address} — PIN {selectedCentre.pincode}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => showToast(`Opening Google Maps navigation to ${selectedCentre.name}`, 'info')}
                    >
                      <Navigation size={13} />
                      <span>Directions</span>
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setIsNewRequestOpen(true)}
                    >
                      <span>Select This Centre</span>
                    </button>
                  </div>
                </div>

                {/* Accepted Categories Checklist (PRD Section 16) */}
                <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Accepted E-Waste Categories at this Centre
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                    {[
                      'Computers & Laptops',
                      'Mobile Phones & Tablets',
                      'Chargers & Cables',
                      'Printers & Scanners',
                      'Small Household Electronics',
                      'Batteries (Safe Containment)'
                    ].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'var(--text-primary)' }}>
                        <CheckCircle size={14} color="var(--eco-primary)" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                  <div>
                    <div className="cert-field-label">Operating Hours</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{selectedCentre.operatingHours}</div>
                  </div>
                  <div>
                    <div className="cert-field-label">Hub Helpline</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{selectedCentre.contactPhone}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

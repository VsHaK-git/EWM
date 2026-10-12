import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EWasteCategory, EWasteItem } from '../../types';
import { X, Plus, Trash2, Camera, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ITEMS: Record<EWasteCategory, { name: string; defaultWeight: number }[]> = {
  'Computing': [
    { name: 'Laptop', defaultWeight: 2.2 },
    { name: 'Desktop (CPU Tower)', defaultWeight: 7.5 },
    { name: 'Monitor (LCD / LED)', defaultWeight: 3.5 },
    { name: 'Keyboard', defaultWeight: 0.6 },
    { name: 'Mouse', defaultWeight: 0.2 },
    { name: 'Printer / Scanner', defaultWeight: 6.0 }
  ],
  'Mobile & Communication': [
    { name: 'Mobile phone', defaultWeight: 0.25 },
    { name: 'Tablet', defaultWeight: 0.5 },
    { name: 'Router / Modem', defaultWeight: 0.8 },
    { name: 'Charger & Adapters', defaultWeight: 0.2 }
  ],
  'Consumer Electronics': [
    { name: 'Television (LCD / LED / CRT)', defaultWeight: 8.0 },
    { name: 'Speakers & Audio System', defaultWeight: 3.5 },
    { name: 'Set-top box', defaultWeight: 1.2 },
    { name: 'Camera & Accessories', defaultWeight: 0.7 }
  ],
  'Electrical/Electronic Accessories': [
    { name: 'UPS (Home / Office)', defaultWeight: 12.0 },
    { name: 'Power Supply / SMPS', defaultWeight: 1.5 },
    { name: 'Cables & Wiring Bundle', defaultWeight: 1.0 },
    { name: 'Batteries (Lithium / Lead)', defaultWeight: 0.8 }
  ]
};

const PUNE_AREAS = [
  'Pimpri',
  'Chinchwad',
  'Wakad',
  'Hinjawadi Phase 1/2/3',
  'Aundh',
  'Baner',
  'Kothrud',
  'Shivajinagar',
  'Hadapsar',
  'Viman Nagar',
  'Kalyani Nagar',
  'Bhosari MIDC'
];

export const RegisterEWasteModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { createPickupRequest, setIsClassifierOpen, showToast } = useApp();

  const [pickupType, setPickupType] = useState<'doorstep' | 'dropoff'>('doorstep');
  const [userName, setUserName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('+91 98231 44521');
  const [email, setEmail] = useState('rahul.sharma@example.in');
  const [area, setArea] = useState('Pimpri');
  const [addressLine, setAddressLine] = useState('Flat 402, Rohan Tarang, Sector 24');
  const [pincode, setPincode] = useState('411018');
  const [preferredDate, setPreferredDate] = useState('2026-10-12');
  const [preferredSlot, setPreferredSlot] = useState('2:00 PM – 4:00 PM');
  const [notes, setNotes] = useState('Devices have been wiped of personal data where accessible.');

  // Items State
  const [items, setItems] = useState<EWasteItem[]>([
    {
      id: 'item-1',
      category: 'Computing',
      subCategory: 'Laptop',
      quantity: 1,
      condition: 'Non-working',
      estimatedWeightKg: 2.2
    }
  ]);

  if (!isOpen) return null;

  const handleAddItem = (category: EWasteCategory = 'Computing') => {
    const defaultSub = CATEGORY_ITEMS[category][0];
    const newItem: EWasteItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category,
      subCategory: defaultSub.name,
      quantity: 1,
      condition: 'Non-working',
      estimatedWeightKg: defaultSub.defaultWeight
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) {
      showToast('At least one e-waste item is required', 'warning');
      return;
    }
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof EWasteItem, value: any) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'category') {
          const firstSub = CATEGORY_ITEMS[value as EWasteCategory][0];
          updated.subCategory = firstSub.name;
          updated.estimatedWeightKg = +(firstSub.defaultWeight * item.quantity).toFixed(1);
        } else if (field === 'subCategory') {
          const found = CATEGORY_ITEMS[item.category].find(s => s.name === value);
          if (found) {
            updated.estimatedWeightKg = +(found.defaultWeight * item.quantity).toFixed(1);
          }
        } else if (field === 'quantity') {
          const num = parseInt(value, 10) || 1;
          const found = CATEGORY_ITEMS[item.category].find(s => s.name === item.subCategory);
          const unitWeight = found ? found.defaultWeight : 1.5;
          updated.quantity = num;
          updated.estimatedWeightKg = +(unitWeight * num).toFixed(1);
        }
        return updated;
      })
    );
  };

  const totalEstimatedKg = items.reduce((sum, item) => sum + (item.estimatedWeightKg || 1), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    createPickupRequest({
      type: pickupType,
      userName,
      contactPhone: phone,
      contactEmail: email,
      address: {
        line1: addressLine,
        area,
        city: 'Pune',
        state: 'Maharashtra',
        pincode
      },
      preferredDate,
      preferredTimeSlot: preferredSlot,
      items,
      estimatedTotalWeightKg: +totalEstimatedKg.toFixed(1),
      notes
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-lg">
        <div className="modal-header">
          <div>
            <h3>Register E-Waste & Schedule Collection</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Step-by-step registration for doorstep collection or civic drop-off
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body">
            {/* Disposal Method Selector */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <div
                onClick={() => setPickupType('doorstep')}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${pickupType === 'doorstep' ? 'var(--eco-primary)' : 'var(--border-light)'}`,
                  background: pickupType === 'doorstep' ? 'var(--eco-subtle)' : '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '14px', color: pickupType === 'doorstep' ? 'var(--eco-dark)' : 'var(--text-primary)' }}>
                  Option 1 — Doorstep Pickup
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  A verified collection partner picks up material from your address with certified weighing.
                </div>
              </div>

              <div
                onClick={() => setPickupType('dropoff')}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${pickupType === 'dropoff' ? 'var(--eco-primary)' : 'var(--border-light)'}`,
                  background: pickupType === 'dropoff' ? 'var(--eco-subtle)' : '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '14px', color: pickupType === 'dropoff' ? 'var(--eco-dark)' : 'var(--text-primary)' }}>
                  Option 2 — Drop-off at Centre
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Hand over material directly at a verified municipal drop-off hub in Pune.
                </div>
              </div>
            </div>

            {/* E-Waste Items Table */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>Items to Dispose of</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                    Total Est. Weight: <strong>{totalEstimatedKg.toFixed(1)} kg</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsClassifierOpen(true)}
                  >
                    <Camera size={13} color="var(--eco-primary)" />
                    <span>Identify with AI</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleAddItem()}
                  >
                    <Plus size={13} />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              <div className="table-container" style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '28%' }}>Category</th>
                      <th style={{ width: '28%' }}>Subcategory</th>
                      <th style={{ width: '12%' }}>Qty</th>
                      <th style={{ width: '20%' }}>Condition</th>
                      <th style={{ width: '12%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td>
                          <select
                            className="form-select"
                            value={item.category}
                            onChange={e => handleItemChange(item.id, 'category', e.target.value as EWasteCategory)}
                            style={{ padding: '6px 8px', fontSize: '12px' }}
                          >
                            <option value="Computing">Computing</option>
                            <option value="Mobile & Communication">Mobile & Comm</option>
                            <option value="Consumer Electronics">Consumer Electronics</option>
                            <option value="Electrical/Electronic Accessories">Accessories & Power</option>
                          </select>
                        </td>
                        <td>
                          <select
                            className="form-select"
                            value={item.subCategory}
                            onChange={e => handleItemChange(item.id, 'subCategory', e.target.value)}
                            style={{ padding: '6px 8px', fontSize: '12px' }}
                          >
                            {CATEGORY_ITEMS[item.category].map(sub => (
                              <option key={sub.name} value={sub.name}>
                                {sub.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            max="999"
                            className="form-input"
                            value={item.quantity}
                            onChange={e => handleItemChange(item.id, 'quantity', e.target.value)}
                            style={{ padding: '6px 8px', fontSize: '12px' }}
                          />
                        </td>
                        <td>
                          <select
                            className="form-select"
                            value={item.condition}
                            onChange={e => handleItemChange(item.id, 'condition', e.target.value)}
                            style={{ padding: '6px 8px', fontSize: '12px' }}
                          >
                            <option value="Non-working">Non-working</option>
                            <option value="Working">Working</option>
                            <option value="Damaged">Damaged</option>
                            <option value="Mixed">Mixed</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                            title="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Address & Slot Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mobile Number <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row" style={{ marginBottom: '16px' }}>
              <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                <label className="form-label">Address Line <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={addressLine}
                  onChange={e => setAddressLine(e.target.value)}
                  placeholder="Building, street, flat number"
                  required
                />
              </div>

              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="form-label">Pune Area <span className="required">*</span></label>
                <select className="form-select" value={area} onChange={e => setArea(e.target.value)}>
                  {PUNE_AREAS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="form-label">PIN Code <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Preferred Date <span className="required">*</span></label>
                <input
                  type="date"
                  className="form-input"
                  value={preferredDate}
                  onChange={e => setPreferredDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Preferred Time Slot <span className="required">*</span></label>
                <select className="form-select" value={preferredSlot} onChange={e => setPreferredSlot(e.target.value)}>
                  <option value="10:00 AM – 12:00 PM">10:00 AM – 12:00 PM</option>
                  <option value="12:00 PM – 2:00 PM">12:00 PM – 2:00 PM</option>
                  <option value="2:00 PM – 4:00 PM">2:00 PM – 4:00 PM</option>
                  <option value="4:00 PM – 6:00 PM">4:00 PM – 6:00 PM</option>
                  <option value="6:00 PM – 8:00 PM">6:00 PM – 8:00 PM</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '14px', marginBottom: 0 }}>
              <label className="form-label">Special Instructions / Remarks</label>
              <textarea
                className="form-textarea"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="E.g., Fragile CRT screens, parking access gate 2, batteries already removed..."
                style={{ minHeight: '60px' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={15} />
              <span>Confirm Pickup Request ({totalEstimatedKg.toFixed(1)} kg)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

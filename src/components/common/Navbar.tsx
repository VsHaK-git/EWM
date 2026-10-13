import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Recycle,
  Search,
  User,
  Truck,
  Factory,
  ShieldCheck,
  Camera,
  RotateCcw,
  Sparkles,
  Menu
} from 'lucide-react';
import { RightSidebarDrawer } from './RightSidebarDrawer';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    activeTab,
    setActiveTab,
    trackingQuery,
    setTrackingQuery,
    setSelectedTrackingRequest,
    findRequestById,
    setIsClassifierOpen,
    resetDemoData,
    showToast
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(trackingQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSearch.trim()) return;

    const matched = findRequestById(localSearch);
    if (matched) {
      setSelectedTrackingRequest(matched);
      setActiveTab('tracking');
      showToast(`Loaded custody record: ${matched.id}`, 'info');
    } else {
      setTrackingQuery(localSearch);
      setActiveTab('tracking');
      showToast(`No exact match for "${localSearch}". Showing search results.`, 'warning');
    }
  };

  const navItemsByRole: Record<UserRole, { id: string; label: string }[]> = {
    individual: [
      { id: 'dashboard', label: 'My Dashboard' },
      { id: 'requests', label: 'E-Waste Pickups' },
      { id: 'tracking', label: 'Track Custody' },
      { id: 'centres', label: 'Collection Centres' },
      { id: 'certificates', label: 'Recycling Records' }
    ],
    organization: [
      { id: 'overview', label: 'Institutional Overview' },
      { id: 'inventory', label: 'IT Asset Inventory' },
      { id: 'requests', label: 'Bulk Pickup Requests' },
      { id: 'certificates', label: 'Form-6 Certificates' },
      { id: 'tracking', label: 'Chain of Custody' }
    ],
    collector: [
      { id: 'route', label: "Today's Route & Pickups" },
      { id: 'assigned', label: 'Assigned Manifest' },
      { id: 'completed', label: 'Completed Deliveries' },
      { id: 'tracking', label: 'Look Up Manifest' }
    ],
    recycler: [
      { id: 'batches', label: 'Incoming Batches' },
      { id: 'processing', label: 'Sorting & Processing' },
      { id: 'certificates', label: 'Compliance Certificates' },
      { id: 'tracking', label: 'Batch Traceability' }
    ],
    admin: [
      { id: 'overview', label: 'State Operations Overview' },
      { id: 'operations', label: 'Pickup Dispatch Queue' },
      { id: 'partners', label: 'Partner & Recycler Verification' },
      { id: 'tracking', label: 'Universal Traceability' },
      { id: 'audit', label: 'Audit Trail' }
    ]
  };

  const activeNavItems = navItemsByRole[role];

  return (
    <header className="top-header">
      <div className="header-inner">
        {/* Brand */}
        <div
          className="brand-section"
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('home')}
          title="Return to EcoCycle Platform Home"
        >
          <div className="brand-logo-badge">
            <Recycle size={20} />
          </div>
          <div className="brand-text">
            <h1>EcoCycle</h1>
            <p>E-Waste Collection & Custody Tracking System</p>
          </div>
        </div>

        {/* Global Tracking Search Input */}
        <form className="header-search" onSubmit={handleSearchSubmit}>
          <Search className="header-search-icon" size={16} />
          <input
            type="text"
            placeholder="Track E-Waste: Enter ID (e.g. EW-2026-004821)..."
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
          />
          <span className="header-search-badge">↵ Enter</span>
        </form>

        {/* Actions & Role Switcher */}
        <div className="header-right">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsClassifierOpen(true)}
            title="Smart Category Classifier (PRD Section 23)"
          >
            <Camera size={14} color="var(--eco-primary)" />
            <span>Smart Classifier</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={resetDemoData}
            title="Reset to authentic Pune seed data"
          >
            <RotateCcw size={13} />
            <span>Reset Demo</span>
          </button>

          <button
            className="header-menu-toggle-btn"
            onClick={() => setIsSidebarOpen(true)}
            title="Open navigation menu drawer"
            aria-label="Open navigation menu drawer"
          >
            <Menu size={15} />
            <span>Menu</span>
          </button>

          {/* Role Switcher */}
          <div className="role-switcher-container">
            <button
              className={`role-tab-btn ${role === 'individual' && activeTab !== 'home' ? 'active' : ''}`}
              onClick={() => {
                setRole('individual');
                setActiveTab('dashboard');
              }}
              title="Citizen View (Rahul Sharma)"
            >
              <User size={14} />
              <span>Citizen</span>
            </button>
            <button
              className={`role-tab-btn ${role === 'collector' && activeTab !== 'home' ? 'active' : ''}`}
              onClick={() => {
                setRole('collector');
                setActiveTab('route');
              }}
              title="Collection Partner (GreenLogix)"
            >
              <Truck size={14} />
              <span>Collector</span>
            </button>
            <button
              className={`role-tab-btn ${role === 'recycler' && activeTab !== 'home' ? 'active' : ''}`}
              onClick={() => {
                setRole('recycler');
                setActiveTab('batches');
              }}
              title="Recycler Facility (MahaRecycle Bhosari)"
            >
              <Factory size={14} />
              <span>Recycler</span>
            </button>
            <button
              className={`role-tab-btn ${role === 'admin' && activeTab !== 'home' ? 'active' : ''}`}
              onClick={() => {
                setRole('admin');
                setActiveTab('overview');
              }}
              title="State Administrator"
            >
              <ShieldCheck size={14} />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-navbar tabs: Shows ONLY Platform Home and the Menu toggle by default */}
      <div className="sub-navbar">
        <div className="sub-navbar-inner">
          <ul className="nav-links-list">
            <li
              className={`nav-link-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles size={14} color={activeTab === 'home' ? 'var(--eco-primary)' : '#10b981'} />
              <span>Platform Home</span>
            </li>
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }}></span>
              <span>Target Region: <strong>Pune Metro & PCMC, Maharashtra</strong></span>
            </div>

            <button
              className="nav-drawer-btn"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation drawer"
              title="Open all portals & navigation drawer"
            >
              <Menu size={16} />
              <span>Menu</span>
              <span className="drawer-btn-badge">
                {activeTab === 'home' ? role.toUpperCase() : activeNavItems.find(i => i.id === activeTab)?.label || role.toUpperCase()}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Right-Side Sliding Navigation Drawer */}
      <RightSidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </header>
  );
};

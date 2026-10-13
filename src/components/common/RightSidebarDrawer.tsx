import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  X,
  Sparkles,
  User,
  Truck,
  Factory,
  ShieldCheck,
  Camera,
  RotateCcw,
  MapPin,
  ChevronRight,
  FileCheck2,
  Calendar,
  Layers,
  ClipboardList,
  Search,
  CheckCircle2,
  Scale
} from 'lucide-react';

interface RightSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RightSidebarDrawer: React.FC<RightSidebarDrawerProps> = ({ isOpen, onClose }) => {
  const {
    role,
    setRole,
    activeTab,
    setActiveTab,
    setIsClassifierOpen,
    resetDemoData,
    showToast
  } = useApp();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItemsByRole: Record<
    UserRole,
    { id: string; label: string; desc: string; icon: React.ReactNode }[]
  > = {
    individual: [
      {
        id: 'dashboard',
        label: 'My Dashboard',
        desc: 'Overview of pickups & environmental savings',
        icon: <Calendar size={18} />
      },
      {
        id: 'requests',
        label: 'E-Waste Pickups',
        desc: 'Schedule & review doorstep collections',
        icon: <Scale size={18} />
      },
      {
        id: 'tracking',
        label: 'Track Custody',
        desc: 'Real-time GPS transit & weighbridge log',
        icon: <Search size={18} />
      },
      {
        id: 'centres',
        label: 'Collection Centres',
        desc: '18 verified drop-off hubs in Pune & PCMC',
        icon: <MapPin size={18} />
      },
      {
        id: 'certificates',
        label: 'Recycling Records',
        desc: 'Form-6 legal certificates & QR codes',
        icon: <FileCheck2 size={18} />
      }
    ],
    organization: [
      {
        id: 'overview',
        label: 'Overview',
        desc: 'Asset lifecycle & audit summary',
        icon: <Calendar size={18} />
      },
      {
        id: 'inventory',
        label: 'IT Asset Inventory',
        desc: 'Manage computer lab equipment registry',
        icon: <Layers size={18} />
      },
      {
        id: 'requests',
        label: 'Bulk Pickup Requests',
        desc: 'Multi-ton commercial vehicle dispatch',
        icon: <Scale size={18} />
      },
      {
        id: 'certificates',
        label: 'Form-6 Certificates',
        desc: 'ESG compliance records & audits',
        icon: <FileCheck2 size={18} />
      },
      {
        id: 'tracking',
        label: 'Chain of Custody',
        desc: 'Universal manifest tracking',
        icon: <Search size={18} />
      }
    ],
    collector: [
      {
        id: 'route',
        label: "Today's Route & Pickups",
        desc: 'Optimized dispatch route in Pune',
        icon: <Truck size={18} />
      },
      {
        id: 'assigned',
        label: 'Assigned Manifest',
        desc: 'Calibrated scale weighing & photo proof',
        icon: <Scale size={18} />
      },
      {
        id: 'completed',
        label: 'Completed Deliveries',
        desc: 'Delivered manifests to Bhosari smelter',
        icon: <CheckCircle2 size={18} />
      },
      {
        id: 'tracking',
        label: 'Look Up Manifest',
        desc: 'Verify consignment ID & recipient plant',
        icon: <Search size={18} />
      }
    ],
    recycler: [
      {
        id: 'batches',
        label: 'Incoming Batches',
        desc: 'MIDC smelter gate intake & weighbridge',
        icon: <Layers size={18} />
      },
      {
        id: 'processing',
        label: 'Sorting & Processing',
        desc: 'Shredding, hydrometallurgy & rare metals',
        icon: <Factory size={18} />
      },
      {
        id: 'certificates',
        label: 'Compliance Certificates',
        desc: 'Mint Rule 13 Form-6 destruction proof',
        icon: <FileCheck2 size={18} />
      },
      {
        id: 'tracking',
        label: 'Batch Traceability',
        desc: 'End-to-end chain of custody audit',
        icon: <Search size={18} />
      }
    ],
    admin: [
      {
        id: 'overview',
        label: 'State Operations Overview',
        desc: 'Pune & PCMC civic recycling metrics',
        icon: <ShieldCheck size={18} />
      },
      {
        id: 'operations',
        label: 'Pickup Dispatch Queue',
        desc: 'Live allocation & regional logistics',
        icon: <ClipboardList size={18} />
      },
      {
        id: 'partners',
        label: 'Partner Verification',
        desc: 'MPCB licenses & facility audits',
        icon: <CheckCircle2 size={18} />
      },
      {
        id: 'tracking',
        label: 'Universal Traceability',
        desc: 'Real-time state manifest ledger',
        icon: <Search size={18} />
      },
      {
        id: 'audit',
        label: 'Audit Trail',
        desc: 'Tamper-evident statutory event logs',
        icon: <FileCheck2 size={18} />
      }
    ]
  };

  const roleConfigs: { id: UserRole; label: string; icon: React.ReactNode }[] = [
    { id: 'individual', label: 'Citizen', icon: <User size={15} /> },
    { id: 'collector', label: 'Collector', icon: <Truck size={15} /> },
    { id: 'recycler', label: 'Recycler', icon: <Factory size={15} /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck size={15} /> }
  ];

  const handleSelectNav = (tabId: string) => {
    setActiveTab(tabId);
    onClose();
  };

  const handleSelectRole = (newRole: UserRole) => {
    setRole(newRole);
    // Switch to first tab of new role if currently on home
    const firstTab = navItemsByRole[newRole][0]?.id || 'dashboard';
    setActiveTab(firstTab);
    showToast(`Switched to ${newRole.toUpperCase()} View`, 'info');
  };

  const currentNavItems = navItemsByRole[role] || [];

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Slide-out Drawer Container */}
      <aside
        className={`drawer-panel ${isOpen ? 'open' : ''}`}
        aria-label="Navigation drawer"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-brand-block">
            <div className="drawer-logo-badge">
              <Sparkles size={18} color="#ffffff" />
            </div>
            <div>
              <h3 className="drawer-title">Platform Navigation</h3>
              <p className="drawer-subtitle">All Portals, Tools & Views</p>
            </div>
          </div>

          <button
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
            title="Close menu (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="drawer-body">
          {/* Platform Home Quick Item */}
          <div className="drawer-section">
            <div
              className={`drawer-home-card ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleSelectNav('home')}
            >
              <div className="drawer-home-icon">
                <Sparkles size={20} />
              </div>
              <div className="drawer-home-text">
                <div className="drawer-home-title">Platform Home</div>
                <div className="drawer-home-desc">Hero overview, impact simulator & circular flow</div>
              </div>
              <ChevronRight size={16} className="drawer-arrow" />
            </div>
          </div>

          {/* Stakeholder Role Switcher */}
          <div className="drawer-section">
            <div className="drawer-section-label">
              <span>SWITCH OPERATIONAL PORTAL</span>
            </div>
            <div className="drawer-role-grid">
              {roleConfigs.map(item => {
                const isActive = role === item.id && activeTab !== 'home';
                return (
                  <button
                    key={item.id}
                    className={`drawer-role-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectRole(item.id)}
                  >
                    <span className="drawer-role-icon">{item.icon}</span>
                    <span className="drawer-role-name">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Role's Hidden Navigation Sections */}
          <div className="drawer-section">
            <div className="drawer-section-label">
              <span>{role.toUpperCase()} PORTAL SECTIONS</span>
              <span className="drawer-section-count">{currentNavItems.length} Sections</span>
            </div>

            <div className="drawer-nav-list">
              {currentNavItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    className={`drawer-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectNav(item.id)}
                  >
                    <div className="drawer-nav-icon-box">{item.icon}</div>
                    <div className="drawer-nav-content">
                      <div className="drawer-nav-label-row">
                        <span className="drawer-nav-label">{item.label}</span>
                        {isActive && <span className="drawer-active-chip">Active</span>}
                      </div>
                      <span className="drawer-nav-desc">{item.desc}</span>
                    </div>
                    <ChevronRight size={15} className="drawer-arrow" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Civic Tools & Utilities */}
          <div className="drawer-section">
            <div className="drawer-section-label">
              <span>QUICK CIVIC TOOLS</span>
            </div>

            <div className="drawer-tools-grid">
              <button
                className="drawer-tool-card"
                onClick={() => {
                  setIsClassifierOpen(true);
                  onClose();
                }}
              >
                <div className="drawer-tool-icon green">
                  <Camera size={16} />
                </div>
                <div className="drawer-tool-info">
                  <div className="drawer-tool-title">AI Camera Classifier</div>
                  <div className="drawer-tool-meta">Instant item scan</div>
                </div>
              </button>

              <button
                className="drawer-tool-card"
                onClick={() => handleSelectNav('centres')}
              >
                <div className="drawer-tool-icon blue">
                  <MapPin size={16} />
                </div>
                <div className="drawer-tool-info">
                  <div className="drawer-tool-title">Pune Depots</div>
                  <div className="drawer-tool-meta">18 collection points</div>
                </div>
              </button>

              <button
                className="drawer-tool-card"
                onClick={() => handleSelectNav('tracking')}
              >
                <div className="drawer-tool-icon amber">
                  <Search size={16} />
                </div>
                <div className="drawer-tool-info">
                  <div className="drawer-tool-title">Live Custody</div>
                  <div className="drawer-tool-meta">Lookup manifest</div>
                </div>
              </button>

              <button
                className="drawer-tool-card"
                onClick={() => {
                  resetDemoData();
                  onClose();
                }}
              >
                <div className="drawer-tool-icon gray">
                  <RotateCcw size={16} />
                </div>
                <div className="drawer-tool-info">
                  <div className="drawer-tool-title">Reset Demo</div>
                  <div className="drawer-tool-meta">Reload seed data</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <div className="drawer-footer-row">
            <span className="drawer-footer-pulse"></span>
            <span>Target Region: <strong>Pune & PCMC, Maharashtra</strong></span>
          </div>
          <div className="drawer-footer-sub">
            Compliant with India E-Waste (Management) Rules, 2022
          </div>
        </div>
      </aside>
    </>
  );
};

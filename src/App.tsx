import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { UserDashboard } from './components/user/UserDashboard';
import { OrgDashboard } from './components/organization/OrgDashboard';
import { CollectorDashboard } from './components/collector/CollectorDashboard';
import { RecyclerDashboard } from './components/recycler/RecyclerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { HeroLandingView } from './components/home/HeroLandingView';
import { TrackingView } from './components/tracking/TrackingView';
import { CollectionPointsView } from './components/map/CollectionPointsView';
import { CertificateModal } from './components/certificate/CertificateModal';
import { SmartClassifierModal } from './components/classifier/SmartClassifierModal';
import { NotificationToast } from './components/common/NotificationToast';
import { AIChatAssistantWidget } from './components/chat/AIChatAssistantWidget';

const MainContent: React.FC = () => {
  const { role, activeTab } = useApp();

  // Landing / Hero Overview
  if (activeTab === 'home') {
    return <HeroLandingView />;
  }

  // Universal Views available across roles
  if (activeTab === 'tracking') {
    return <TrackingView />;
  }

  if (activeTab === 'centres') {
    return <CollectionPointsView />;
  }

  // Role-Specific Views
  switch (role) {
    case 'individual':
      return <UserDashboard />;
    case 'organization':
      return <OrgDashboard />;
    case 'collector':
      return <CollectorDashboard />;
    case 'recycler':
      return <RecyclerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <UserDashboard />;
  }
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="app-layout">
        <Navbar />
        <main className="main-wrapper">
          <MainContent />
        </main>
        
        {/* Modals, Overlays & AI Assistant Widget */}
        <CertificateModal />
        <SmartClassifierModal />
        <NotificationToast />
        <AIChatAssistantWidget />

        {/* Civic Operational Footer */}
        <footer style={{ borderTop: '1px solid var(--border-light)', background: '#ffffff', padding: '16px 24px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <strong>EcoCycle Platform</strong>
              <span>•</span>
              <span>Regulatory Compliance: India E-Waste (Management) Rules, 2022</span>
              <span>•</span>
              <span>Central Pollution Control Board (CPCB) & MPCB Registered System</span>
            </div>
            <div>
              <span>Pune Municipal Corporation (PMC) & PCMC Reverse Logistics Pilot</span>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
};

export default App;

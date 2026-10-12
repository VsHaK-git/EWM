import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Recycle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Building2,
  Factory,
  User,
  Scale,
  Search,
  Leaf,
  Cpu,
  Zap,
  CheckCircle2,
  FileCheck2,
  Camera,
  MapPin,
  TrendingUp,
  Award,
  ChevronRight,
  Play,
  RotateCcw
} from 'lucide-react';

export const HeroLandingView: React.FC = () => {
  const {
    setRole,
    setActiveTab,
    setIsNewRequestOpen,
    setIsClassifierOpen,
    setSelectedTrackingRequest,
    findRequestById,
    pickupRequests,
    showToast
  } = useApp();

  const [heroSearchId, setHeroSearchId] = useState('');

  // Interactive Material Calculator State
  const [calcLaptops, setCalcLaptops] = useState(2);
  const [calcPhones, setCalcPhones] = useState(3);
  const [calcMonitors, setCalcMonitors] = useState(1);
  const [calcCablesKg, setCalcCablesKg] = useState(2);

  // Dynamic calculations
  const totalCalcWeight = (
    calcLaptops * 2.2 +
    calcPhones * 0.2 +
    calcMonitors * 4.5 +
    calcCablesKg
  ).toFixed(1);

  const preciousMetalsGrams = (
    calcLaptops * 0.25 +
    calcPhones * 0.035 +
    calcMonitors * 0.15 +
    calcCablesKg * 0.4
  ).toFixed(2);

  const co2SavedKg = (parseFloat(totalCalcWeight) * 1.85).toFixed(1);
  const toxicsDivertedGrams = (calcLaptops * 8 + calcMonitors * 25 + calcPhones * 3).toFixed(0);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = heroSearchId.trim() || 'EW-2026-004821';
    const found = findRequestById(query);
    if (found) {
      setSelectedTrackingRequest(found);
      setActiveTab('tracking');
      showToast(`Loaded custody record: ${found.id}`, 'info');
    } else {
      setSelectedTrackingRequest(pickupRequests[0]);
      setActiveTab('tracking');
      showToast(`Loaded live manifest: ${pickupRequests[0]?.id || query}`, 'info');
    }
  };

  const handleLaunchRolePortal = (targetRole: UserRole, targetTab: string) => {
    setRole(targetRole);
    setActiveTab(targetTab);
    showToast(`Switched to ${targetRole.toUpperCase()} Portal`, 'info');
  };

  return (
    <div className="hero-landing-page">
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="crazy-hero-section">
        {/* Animated Background Ambience */}
        <div className="hero-grid-mesh"></div>
        <div className="hero-ambient-orb orb-1"></div>
        <div className="hero-ambient-orb orb-2"></div>
        <div className="hero-ambient-orb orb-3"></div>

        <div className="hero-inner-container">
          {/* Top Pill Announcement */}
          <div className="hero-badge-pill">
            <span className="pulse-beacon"></span>
            <span className="badge-highlight">INDIA'S 1ST TRACEABLE E-WASTE INFRASTRUCTURE</span>
            <span className="badge-divider">•</span>
            <span className="badge-region">PUNE & PCMC PILOT</span>
          </div>

          {/* Massive Headline */}
          <h1 className="crazy-hero-headline">
            Don’t Let Old Tech Become Toxic Waste.{' '}
            <span className="shimmer-text">Turn It Into Certified Circular Value.</span>
          </h1>

          {/* Subtitle */}
          <p className="crazy-hero-subtext">
            End-to-end civic and industrial reverse logistics compliant with <strong>India E-Waste Rules 2022</strong>.
            Schedule calibrated doorstep pickups, track real-time custody from Kothrud to Bhosari MIDC, and receive legally verifiable <strong>Form-6 recycling certificates</strong>.
          </p>

          {/* Primary Action Buttons */}
          <div className="hero-actions-cluster">
            <button
              className="crazy-btn crazy-btn-primary"
              onClick={() => setIsNewRequestOpen(true)}
            >
              <Zap size={18} />
              <span>Schedule Free Doorstep Pickup</span>
              <ArrowRight size={16} />
            </button>

            <button
              className="crazy-btn crazy-btn-ai"
              onClick={() => setIsClassifierOpen(true)}
            >
              <Sparkles size={17} className="sparkle-icon" />
              <span>Try AI E-Waste Classifier</span>
            </button>

            <button
              className="crazy-btn crazy-btn-ghost"
              onClick={() => setActiveTab('centres')}
            >
              <MapPin size={16} />
              <span>Pune Drop-Off Depots</span>
            </button>
          </div>

          {/* Hero Live Manifest Tracker Bar */}
          <div className="hero-tracking-glass-bar">
            <div className="tracker-label">
              <Search size={16} className="tracker-icon" />
              <span>Live Custody Lookup</span>
            </div>
            <form onSubmit={handleTrackSubmit} className="tracker-form">
              <input
                type="text"
                placeholder="Enter Manifest ID (e.g. EW-2026-004821 or EW-2026-004824)..."
                value={heroSearchId}
                onChange={e => setHeroSearchId(e.target.value)}
              />
              <button type="submit" className="tracker-btn">
                <span>Track Manifest</span>
                <ArrowRight size={14} />
              </button>
            </form>
            <div className="tracker-samples">
              <span>Quick tests:</span>
              <button
                type="button"
                className="chip-tag"
                onClick={() => {
                  const req = findRequestById('EW-2026-004821');
                  if (req) {
                    setSelectedTrackingRequest(req);
                    setActiveTab('tracking');
                  }
                }}
              >
                EW-2026-004821 (In Transit)
              </button>
              <button
                type="button"
                className="chip-tag"
                onClick={() => {
                  const req = findRequestById('EW-2026-004820');
                  if (req) {
                    setSelectedTrackingRequest(req);
                    setActiveTab('tracking');
                  }
                }}
              >
                EW-2026-004820 (Certified)
              </button>
            </div>
          </div>

          {/* Hero Live Visual Showpiece (Glass Holographic Manifest Card) */}
          <div className="hero-showpiece-wrapper">
            <div className="manifest-preview-card">
              <div className="card-ambient-glow"></div>
              
              <div className="card-top-row">
                <div className="card-stream-badge">
                  <span className="live-radar-dot"></span>
                  <span>LIVE REVERSE LOGISTICS MANIFEST</span>
                </div>
                <div className="card-status-chip">
                  <span className="status-dot-amber"></span>
                  <span>STATUS: IN_TRANSIT</span>
                </div>
              </div>

              <div className="card-main-body">
                <div className="manifest-info-col">
                  <div className="manifest-id-tag">CONSIGNMENT #EW-2026-004821</div>
                  <h3>Hinjawadi IT Park ➔ Bhosari MIDC Smelter</h3>
                  <p>Consignor: TechNova Solutions Ltd • Fleet Carrier: GreenLogix Express (Van MH-14-GH-8291)</p>
                  
                  <div className="custody-stats-grid">
                    <div className="stat-box">
                      <span className="stat-label">Calibrated Weight</span>
                      <span className="stat-val">142.8 kg</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Material Class</span>
                      <span className="stat-val">Computing / Servers</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Precious Recovery</span>
                      <span className="stat-val highlight-green">94.2% Est.</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Legal Form-6</span>
                      <span className="stat-val highlight-blue">Auto-Minting</span>
                    </div>
                  </div>
                </div>

                <div className="manifest-graphic-col">
                  <div className="mini-pipeline-graphic">
                    <div className="pipeline-node done">
                      <CheckCircle2 size={14} />
                      <span>Scheduled</span>
                    </div>
                    <div className="pipeline-connector done"></div>
                    <div className="pipeline-node done">
                      <Scale size={14} />
                      <span>Weighed</span>
                    </div>
                    <div className="pipeline-connector active"></div>
                    <div className="pipeline-node active pulse-node">
                      <Truck size={14} />
                      <span>Transit</span>
                    </div>
                    <div className="pipeline-connector"></div>
                    <div className="pipeline-node">
                      <Factory size={14} />
                      <span>Smelter</span>
                    </div>
                  </div>

                  <button
                    className="card-action-btn"
                    onClick={() => {
                      const req = findRequestById('EW-2026-004821');
                      if (req) {
                        setSelectedTrackingRequest(req);
                        setActiveTab('tracking');
                      }
                    }}
                  >
                    <span>Inspect Chain-of-Custody Log</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Ticker Bottom Bar */}
              <div className="card-bottom-ticker">
                <div className="ticker-item">
                  <ShieldCheck size={14} color="#10b981" />
                  <span>MPCB Authorized: MPCB/RO-PUNE/REC/2024/091</span>
                </div>
                <div className="ticker-item">
                  <Award size={14} color="#38bdf8" />
                  <span>CPCB Rule 13 Compliant Digital Trail</span>
                </div>
                <div className="ticker-item">
                  <Leaf size={14} color="#22c55e" />
                  <span>Zero Toxic Leaching Assured</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Live Impact Metrics Strip */}
          <div className="hero-metrics-strip">
            <div className="metric-cell">
              <div className="metric-icon-wrap green">
                <Leaf size={22} />
              </div>
              <div className="metric-data">
                <div className="metric-number">42.85 <span className="metric-unit">Tons</span></div>
                <div className="metric-label">Diverted from Pune Landfills</div>
              </div>
            </div>

            <div className="metric-cell">
              <div className="metric-icon-wrap blue">
                <FileCheck2 size={22} />
              </div>
              <div className="metric-data">
                <div className="metric-number">1,420+</div>
                <div className="metric-label">Verifiable Form-6 Certificates</div>
              </div>
            </div>

            <div className="metric-cell">
              <div className="metric-icon-wrap amber">
                <Cpu size={22} />
              </div>
              <div className="metric-data">
                <div className="metric-number">98.4%</div>
                <div className="metric-label">Rare Earth & Metal Recovery</div>
              </div>
            </div>

            <div className="metric-cell">
              <div className="metric-icon-wrap purple">
                <Building2 size={22} />
              </div>
              <div className="metric-data">
                <div className="metric-number">94+</div>
                <div className="metric-label">Registered Corporate & Labs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE CIRCULAR ECONOMY CALCULATOR
          ========================================================================= */}
      <section className="section-container calc-section">
        <div className="section-header-centered">
          <div className="section-pill">
            <Zap size={14} />
            <span>INSTANT IMPACT SIMULATOR</span>
          </div>
          <h2>What Is Your Electronic Waste Really Worth?</h2>
          <p>
            Old electronics aren't trash—they are concentrated goldmines of recoverable copper, aluminum, and precious elements. See how much carbon and groundwater toxins you prevent today.
          </p>
        </div>

        <div className="calc-interactive-card">
          <div className="calc-inputs-pane">
            <h3>Configure Your E-Waste Quantity</h3>
            <p className="calc-sub">Adjust units to calculate real-time environmental recovery metrics:</p>

            {/* Laptop Counter */}
            <div className="counter-row">
              <div className="counter-info">
                <div className="counter-title">Laptops & Notebooks</div>
                <div className="counter-meta">Avg 2.2 kg • High-grade logic board & Li-ion cells</div>
              </div>
              <div className="counter-controls">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => setCalcLaptops(Math.max(0, calcLaptops - 1))}
                >
                  -
                </button>
                <span className="counter-val">{calcLaptops}</span>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => setCalcLaptops(calcLaptops + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Phone Counter */}
            <div className="counter-row">
              <div className="counter-info">
                <div className="counter-title">Smartphones & Tablets</div>
                <div className="counter-meta">Avg 0.2 kg • Gold traces, cobalt & lithium</div>
              </div>
              <div className="counter-controls">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => setCalcPhones(Math.max(0, calcPhones - 1))}
                >
                  -
                </button>
                <span className="counter-val">{calcPhones}</span>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => setCalcPhones(calcPhones + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Monitor Counter */}
            <div className="counter-row">
              <div className="counter-info">
                <div className="counter-title">Monitors & Displays</div>
                <div className="counter-meta">Avg 4.5 kg • Copper deflection coils & leaded glass</div>
              </div>
              <div className="counter-controls">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => setCalcMonitors(Math.max(0, calcMonitors - 1))}
                >
                  -
                </button>
                <span className="counter-val">{calcMonitors}</span>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => setCalcMonitors(calcMonitors + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Cables Counter */}
            <div className="counter-row">
              <div className="counter-info">
                <div className="counter-title">Chargers, Adapters & Cables (kg)</div>
                <div className="counter-meta">Heavy pure copper cores & transformer coils</div>
              </div>
              <div className="counter-controls">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => setCalcCablesKg(Math.max(0, calcCablesKg - 1))}
                >
                  -
                </button>
                <span className="counter-val">{calcCablesKg} kg</span>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => setCalcCablesKg(calcCablesKg + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="calc-results-pane">
            <div className="results-badge">
              <Sparkles size={14} />
              <span>CIRCULAR RECOVERY PREDICTION</span>
            </div>

            <div className="total-weight-display">
              <div className="weight-number">{totalCalcWeight} <span className="unit">kg</span></div>
              <div className="weight-label">Total Hazardous E-Waste Kept Out of Pune Waterways</div>
            </div>

            <div className="results-grid">
              <div className="result-metric-card">
                <span className="rm-icon">✨</span>
                <div className="rm-value">{preciousMetalsGrams} g</div>
                <div className="rm-label">Gold, Silver & Copper Extracted</div>
              </div>

              <div className="result-metric-card">
                <span className="rm-icon">🌱</span>
                <div className="rm-value">{co2SavedKg} kg</div>
                <div className="rm-label">CO₂ Eq. Prevented vs Mining Raw Ores</div>
              </div>

              <div className="result-metric-card">
                <span className="rm-icon">🛡️</span>
                <div className="rm-value">{toxicsDivertedGrams} g</div>
                <div className="rm-label">Lead & Heavy Toxins Safely Isolated</div>
              </div>

              <div className="result-metric-card">
                <span className="rm-icon">📜</span>
                <div className="rm-value">100% Legal</div>
                <div className="rm-label">Official CPCB Form-6 Certificate Issued</div>
              </div>
            </div>

            <button
              className="calc-cta-btn"
              onClick={() => setIsNewRequestOpen(true)}
            >
              <Zap size={16} />
              <span>Book Pickup For These {totalCalcWeight} kg Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5 ROLE PORTAL LAUNCHPAD
          ========================================================================= */}
      <section className="section-container portals-launchpad-section">
        <div className="section-header-centered">
          <div className="section-pill">
            <ShieldCheck size={14} />
            <span>MULTI-STAKEHOLDER ARCHITECTURE</span>
          </div>
          <h2>Dedicated Portals For Every Step of the Chain</h2>
          <p>
            EcoCycle connects household citizens, corporate campuses, logistics fleets, and smelting recyclers into one unified compliance network.
          </p>
        </div>

        <div className="portals-grid">
          {/* Card 1: Citizen */}
          <div className="portal-card" onClick={() => handleLaunchRolePortal('individual', 'dashboard')}>
            <div className="portal-icon-box green">
              <User size={24} />
            </div>
            <div className="portal-tag">Households & Citizens</div>
            <h3>Citizen Disposal Portal</h3>
            <p>
              Schedule free doorstep pickups in 60 seconds, choose convenient Pune time slots, and verify calibrated weights on-site.
            </p>
            <ul className="portal-bullet-list">
              <li><CheckCircle2 size={14} /> Free doorstep doorstep service</li>
              <li><CheckCircle2 size={14} /> Digital scale slip on arrival</li>
              <li><CheckCircle2 size={14} /> Green recycling milestones</li>
            </ul>
            <div className="portal-action-row">
              <span>Open Citizen Portal</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 2: Institution */}
          <div className="portal-card featured" onClick={() => handleLaunchRolePortal('organization', 'overview')}>
            <div className="featured-ribbon">ENTERPRISE & CSR</div>
            <div className="portal-icon-box blue">
              <Building2 size={24} />
            </div>
            <div className="portal-tag">Colleges & IT Parks</div>
            <h3>Institutional & Bulk Portal</h3>
            <p>
              Decommission computer labs, servers, and office IT equipment with serial number tracking, multi-asset manifests, and ESG auditing.
            </p>
            <ul className="portal-bullet-list">
              <li><CheckCircle2 size={14} /> IT asset register & serial tags</li>
              <li><CheckCircle2 size={14} /> Multi-ton bulk scheduling</li>
              <li><CheckCircle2 size={14} /> Auditable Form-6 CSR certificates</li>
            </ul>
            <div className="portal-action-row">
              <span>Open Enterprise Portal</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 3: Collector */}
          <div className="portal-card" onClick={() => handleLaunchRolePortal('collector', 'route')}>
            <div className="portal-icon-box amber">
              <Truck size={24} />
            </div>
            <div className="portal-tag">Logistics & Fleets</div>
            <h3>Field Collector App</h3>
            <p>
              GPS route management, digital weighing scale integration, photo evidence uploads, and instant custody handovers.
            </p>
            <ul className="portal-bullet-list">
              <li><CheckCircle2 size={14} /> Dynamic Pune route dispatch</li>
              <li><CheckCircle2 size={14} /> Calibrated scale weight logging</li>
              <li><CheckCircle2 size={14} /> Discrepancy & fraud prevention</li>
            </ul>
            <div className="portal-action-row">
              <span>Open Collector Portal</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 4: Recycler */}
          <div className="portal-card" onClick={() => handleLaunchRolePortal('recycler', 'batches')}>
            <div className="portal-icon-box purple">
              <Factory size={24} />
            </div>
            <div className="portal-tag">Bhosari MIDC Plants</div>
            <h3>Authorized Recycler Hub</h3>
            <p>
              Manifest batch receipt, mechanical shredding, hydrometallurgical recovery records, and automated legal certificate generation.
            </p>
            <ul className="portal-bullet-list">
              <li><CheckCircle2 size={14} /> Inbound batch scale intake</li>
              <li><CheckCircle2 size={14} /> Material segregation metrics</li>
              <li><CheckCircle2 size={14} /> CPCB/MPCB compliant certificate minting</li>
            </ul>
            <div className="portal-action-row">
              <span>Open Recycler Hub</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 5: Admin */}
          <div className="portal-card" onClick={() => handleLaunchRolePortal('admin', 'overview')}>
            <div className="portal-icon-box teal">
              <ShieldCheck size={24} />
            </div>
            <div className="portal-tag">Regulatory & State Ops</div>
            <h3>Civic Admin & Audit Desk</h3>
            <p>
              Central command desk for monitoring collection quotas, partner licensing status, fraud alerts, and universal custody traceability.
            </p>
            <ul className="portal-bullet-list">
              <li><CheckCircle2 size={14} /> Master dispatch & route queue</li>
              <li><CheckCircle2 size={14} /> MPCB license validity monitoring</li>
              <li><CheckCircle2 size={14} /> Tamper-proof audit trails</li>
            </ul>
            <div className="portal-action-row">
              <span>Open Admin Desk</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS PIPELINE
          ========================================================================= */}
      <section className="section-container workflow-section">
        <div className="section-header-centered">
          <div className="section-pill">
            <Recycle size={14} />
            <span>CIRCULAR JOURNEY</span>
          </div>
          <h2>From Your Desk to Certified Sustainable Recovery</h2>
          <p>
            Every gram of discarded electronics follows an unbroken, verified chain of custody.
          </p>
        </div>

        <div className="workflow-steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon-wrap">
              <Camera size={24} />
            </div>
            <h4>AI Scan or Book</h4>
            <p>
              Scan your old devices using our camera classifier or book doorstep collection in seconds with preferred time slots.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon-wrap">
              <Scale size={24} />
            </div>
            <h4>Calibrated Weighing</h4>
            <p>
              Authorized logistics partner arrives with calibrated portable scales. Actual weight is logged and photographed on-site.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon-wrap">
              <Truck size={24} />
            </div>
            <h4>Secure Barcoded Transit</h4>
            <p>
              E-waste is barcoded and safely transported to government-licensed facilities in Bhosari MIDC without leakage or dumping.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>
            <div className="step-icon-wrap">
              <Award size={24} />
            </div>
            <h4>Certified Form-6 PDF</h4>
            <p>
              Recovered metals re-enter the circular supply chain. You receive a verifiable government-compliant recycling certificate.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CALL TO ACTION BANNER
          ========================================================================= */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-bg-glow"></div>
          <div className="cta-content">
            <div className="cta-badge">
              <Leaf size={14} />
              <span>ZERO LANDFILL PUNE INITIATIVE</span>
            </div>
            <h2>Ready to Clear Your Old Electronics Responsibly?</h2>
            <p>
              Join thousands of conscious Pune citizens and 90+ IT companies making electronics circular. Zero cost, zero hassle, 100% legal compliance.
            </p>
            <div className="cta-buttons-row">
              <button
                className="crazy-btn crazy-btn-primary"
                onClick={() => setIsNewRequestOpen(true)}
              >
                <Zap size={18} />
                <span>Schedule Doorstep Pickup</span>
                <ArrowRight size={16} />
              </button>
              <button
                className="crazy-btn crazy-btn-ghost-light"
                onClick={() => setActiveTab('centres')}
              >
                <MapPin size={16} />
                <span>Explore 18 Pune Collection Depots</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Minus,
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    icon?: string;
    onClick: () => void;
  }[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    text: "Hello! I'm **EcoCycle AI**, your Pune & PCMC e-waste guide. I can help you schedule doorstep pickups, find nearby drop-off depots, track custody manifests, or answer compliance questions under India E-Waste Rules 2022.",
    timestamp: 'Just now'
  }
];

const SUGGESTED_QUESTIONS = [
  '📦 How do I schedule a pickup?',
  '📍 Find Pune drop-off depots',
  '🔍 Track manifest EW-2026-004821',
  '📷 How does AI Classifier work?',
  '📜 What is a Form-6 certificate?'
];

export const AIChatAssistantWidget: React.FC = () => {
  const {
    setActiveTab,
    setIsNewRequestOpen,
    setIsClassifierOpen,
    setSelectedTrackingRequest,
    findRequestById,
    setRole,
    pickupRequests,
    collectionCentres
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgCounterRef = useRef(1);

  // Auto-scroll to bottom of message list
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  const generateAIResponse = (userQuery: string): { text: string; actions?: ChatMessage['actions'] } => {
    const q = userQuery.toLowerCase().trim();

    // 1. Pickup Scheduling
    if (q.includes('schedule') || q.includes('pickup') || q.includes('book') || q.includes('doorstep') || q.includes('collect')) {
      return {
        text: "You can schedule a **free doorstep pickup** in 60 seconds! Our authorized logistics partners (GreenLogix) arrive with calibrated portable scales and issue instant digital weighbridge receipts across Pune & PCMC.",
        actions: [
          {
            label: '⚡ Open Pickup Booking Form',
            onClick: () => setIsNewRequestOpen(true)
          },
          {
            label: '📍 Or Find Drop-Off Hubs',
            onClick: () => setActiveTab('centres')
          }
        ]
      };
    }

    // 2. Tracking Manifests / Consignments
    if (q.includes('track') || q.includes('manifest') || q.includes('ew-') || q.includes('status') || q.includes('consignment')) {
      // Check for specific manifest ID pattern
      const manifestMatch = q.match(/ew-\d{4}-\d{6}/i);
      const searchId = manifestMatch ? manifestMatch[0].toUpperCase() : 'EW-2026-004821';
      const req = findRequestById(searchId) || pickupRequests[0];

      if (req) {
        return {
          text: `Manifest **${req.id}** status is **${req.status.replace(/_/g, ' ')}**.\n\n• **Consignor:** ${req.userName}\n• **Pickup Area:** ${req.address.area}, Pune\n• **Weight:** ${req.actualCollectedWeightKg ? `${req.actualCollectedWeightKg} kg (Calibrated)` : `~${req.estimatedTotalWeightKg} kg (Est.)`}\n• **Assigned Transporter:** ${req.assignedCollectorName || 'GreenLogix Logistics'}`,
          actions: [
            {
              label: `🔍 View Chain-of-Custody for ${req.id}`,
              onClick: () => {
                setSelectedTrackingRequest(req);
                setActiveTab('tracking');
              }
            }
          ]
        };
      }

      return {
        text: "You can track any e-waste consignment in real time using its Manifest ID (e.g. `EW-2026-004821`). Every event logs GPS coordinates, digital weighbridge readings, and tamper-proof custody signatures.",
        actions: [
          {
            label: '🔍 Open Live Custody Tracker',
            onClick: () => setActiveTab('tracking')
          }
        ]
      };
    }

    // 3. Drop-off Centres / Depots
    if (q.includes('centre') || q.includes('center') || q.includes('depot') || q.includes('location') || q.includes('drop') || q.includes('where') || q.includes('map')) {
      return {
        text: `We maintain **${collectionCentres.length} authorized e-waste depots** across Pune & PCMC, including hubs in **Kothrud, Wakad, Pimpri, Aundh, Camp, and Bhosari MIDC**. All depots are equipped with precision balances and secure battery containment.`,
        actions: [
          {
            label: '📍 Open Pune Collection Depots Map',
            onClick: () => setActiveTab('centres')
          }
        ]
      };
    }

    // 4. AI Camera Classifier
    if (q.includes('camera') || q.includes('classify') || q.includes('classifier') || q.includes('ai') || q.includes('scan') || q.includes('photo')) {
      return {
        text: "Our **Smart AI E-Waste Classifier** uses computer vision to detect device types (laptops, CRT/LCD displays, logic boards, cables) and recommends proper hazardous handling according to CPCB criteria.",
        actions: [
          {
            label: '✨ Launch Smart Camera Classifier',
            onClick: () => setIsClassifierOpen(true)
          }
        ]
      };
    }

    // 5. Certificate / Form-6 / Legal Rules
    if (q.includes('certificate') || q.includes('form-6') || q.includes('form 6') || q.includes('legal') || q.includes('cpcb') || q.includes('mpcb') || q.includes('compliance')) {
      return {
        text: "A **Form-6 Certificate of Responsible Recycling** is issued under Rule 13 of India E-Waste (Management) Rules, 2022 once your electronics undergo scientific dismantling at Bhosari MIDC. It includes a verifiable QR code preventing greenwashing.",
        actions: [
          {
            label: '📜 View Recycling Records',
            onClick: () => {
              setRole('individual');
              setActiveTab('certificates');
            }
          }
        ]
      };
    }

    // 6. Roles & Portals
    if (q.includes('role') || q.includes('collector') || q.includes('recycler') || q.includes('admin') || q.includes('citizen') || q.includes('portal')) {
      return {
        text: "EcoCycle has 4 dedicated stakeholder portals:\n• **Citizen**: Schedule doorstep pickups & view green credits\n• **Collector**: GPS routing & calibrated scale logging\n• **Recycler**: Smelter gate receiving & material recovery\n• **Admin**: MPCB licensing audits & state custody trails",
        actions: [
          {
            label: '👤 Citizen View',
            onClick: () => {
              setRole('individual');
              setActiveTab('dashboard');
            }
          },
          {
            label: '🚚 Collector App',
            onClick: () => {
              setRole('collector');
              setActiveTab('route');
            }
          },
          {
            label: '🏭 Recycler Hub',
            onClick: () => {
              setRole('recycler');
              setActiveTab('batches');
            }
          }
        ]
      };
    }

    // 7. General fallback
    return {
      text: "I can help with anything on the EcoCycle platform! Ask me about:\n• Booking free doorstep collections in Pune\n• Finding verified drop-off hubs nearby\n• Tracking live reverse logistics manifests\n• How rare metals (Gold, Silver, Copper) are recovered safely",
      actions: [
        {
          label: '📦 Schedule Free Pickup',
          onClick: () => setIsNewRequestOpen(true)
        },
        {
          label: '✨ Try AI Classifier',
          onClick: () => setIsClassifierOpen(true)
        }
      ]
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${++msgCounterRef.current}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate responsive AI thinking & typing
    setTimeout(() => {
      const response = generateAIResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${++msgCounterRef.current}`,
        sender: 'assistant',
        text: response.text,
        timestamp: 'Just now',
        actions: response.actions
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInputText('');
    setIsTyping(false);
  };

  return (
    <>
      {/* =========================================================================
          1. FLOATING CHAT TRIGGER BUTTON (BOTTOM-RIGHT)
          ========================================================================= */}
      <div className="floating-chat-trigger-wrap">
        {!isOpen && (
          <button
            className="floating-chat-btn"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              setHasUnread(false);
            }}
            aria-label="Open EcoCycle AI Chat Assistant"
            title="Chat with EcoCycle AI Assistant"
          >
            <div className="floating-chat-icon-box">
              <Bot size={22} className="floating-bot-icon" />
              <Sparkles size={13} className="floating-sparkle-icon" />
            </div>
            <span className="floating-chat-label">EcoCycle AI</span>
            {hasUnread && <span className="floating-unread-dot" />}
          </button>
        )}
      </div>

      {/* =========================================================================
          2. FLOATING CHAT WINDOW POPUP
          ========================================================================= */}
      {isOpen && (
        <div className={`floating-chat-window ${isMinimized ? 'minimized' : ''}`}>
          {/* Chat Window Header */}
          <div className="chat-window-header">
            <div className="chat-header-identity">
              <div className="chat-avatar-badge">
                <Bot size={18} color="#ffffff" />
                <span className="chat-online-beacon" />
              </div>
              <div className="chat-header-text">
                <div className="chat-header-title">
                  <span>EcoCycle AI</span>
                  <span className="chat-verified-chip">
                    <ShieldCheck size={11} />
                    <span>Verified</span>
                  </span>
                </div>
                <div className="chat-header-status">Pune E-Waste Civic Assistant</div>
              </div>
            </div>

            <div className="chat-header-actions">
              <button
                className="chat-header-btn"
                onClick={resetChat}
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <RotateCcw size={14} />
              </button>

              <button
                className="chat-header-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand chat' : 'Minimize chat'}
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                <Minus size={15} />
              </button>

              <button
                className="chat-header-btn close"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Chat Body (Hidden when minimized) */}
          {!isMinimized && (
            <>
              {/* Message History List */}
              <div className="chat-messages-container">
                {messages.map(msg => (
                  <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                    {msg.sender === 'assistant' && (
                      <div className="chat-msg-avatar">
                        <Bot size={14} color="#ffffff" />
                      </div>
                    )}

                    <div className="chat-bubble-wrap">
                      <div className={`chat-bubble ${msg.sender}`}>
                        <div
                          className="chat-bubble-text"
                          dangerouslySetInnerHTML={{
                            __html: msg.text
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\n\n/g, '<br/><br/>')
                              .replace(/\n/g, '<br/>')
                              .replace(/`([^`]+)`/g, '<code class="chat-code">$1</code>')
                          }}
                        />

                        {/* Interactive Action Buttons */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="chat-actions-cluster">
                            {msg.actions.map((act, idx) => (
                              <button
                                key={idx}
                                className="chat-action-btn"
                                onClick={() => {
                                  act.onClick();
                                  setIsOpen(false);
                                }}
                              >
                                <span>{act.label}</span>
                                <ChevronRight size={13} />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="chat-timestamp">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <div className="chat-message-row assistant">
                    <div className="chat-msg-avatar">
                      <Bot size={14} color="#ffffff" />
                    </div>
                    <div className="chat-typing-bubble">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Quick Prompt Chips */}
              <div className="chat-quick-chips-bar">
                <div className="chat-chips-scroll">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      className="chat-chip-btn"
                      onClick={() => handleSendMessage(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Row */}
              <div className="chat-input-bar">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask about pickups, depots, tracking..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="chat-input-field"
                />
                <button
                  type="button"
                  className="chat-send-btn"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  title="Send message"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </div>

              {/* Trust & Compliance Micro Footer */}
              <div className="chat-micro-footer">
                <span className="micro-radar-dot" />
                <span>India E-Waste Rules 2022 • Pune & PCMC Reverse Logistics</span>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

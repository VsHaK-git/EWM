import React from 'react';
import { CustodyEvent } from '../../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, User, Scale, FileText, CheckCircle } from 'lucide-react';

interface TimelineProps {
  events: CustodyEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return <div style={{ color: 'var(--text-muted)', padding: '16px 0' }}>No custody events logged yet.</div>;
  }

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="timeline-container">
      <div className="timeline-line" />
      {events.map((event, index) => {
        const isLatest = index === events.length - 1;
        return (
          <div key={event.id || index} className="timeline-step">
            <div className={`timeline-node ${isLatest ? 'completed' : ''}`}>
              <CheckCircle size={12} color={isLatest ? '#ffffff' : 'var(--eco-primary)'} />
            </div>
            <div className="timeline-content">
              <div className="timeline-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="timeline-title">{event.title}</span>
                  <StatusBadge status={event.status} size="sm" />
                </div>
                <span className="timeline-meta">{formatDate(event.timestamp)}</span>
              </div>

              <div className="timeline-desc">{event.description}</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                <span className="timeline-actor-chip">
                  <User size={12} />
                  <span>{event.responsibleParty} ({event.role})</span>
                </span>

                <span className="timeline-actor-chip">
                  <MapPin size={12} />
                  <span>{event.location}</span>
                </span>

                {event.weightKg !== undefined && (
                  <span className="timeline-actor-chip" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534', fontWeight: 600 }}>
                    <Scale size={12} />
                    <span>Certified Weight: {event.weightKg} kg</span>
                  </span>
                )}

                {event.documentRef && (
                  <span className="timeline-actor-chip" style={{ background: '#f8fafc', borderColor: '#cbd5e1' }}>
                    <FileText size={12} />
                    <span>Doc: {event.documentRef}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

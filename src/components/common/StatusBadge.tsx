import React from 'react';
import { OperationalStatus } from '../../types';
import {
  Clock,
  Calendar,
  UserCheck,
  Truck,
  PackageCheck,
  ArrowRightLeft,
  Building2,
  Cpu,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface StatusBadgeProps {
  status: OperationalStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'REQUESTED':
        return { label: 'Requested', icon: Clock, className: 'REQUESTED' };
      case 'SCHEDULED':
        return { label: 'Scheduled', icon: Calendar, className: 'SCHEDULED' };
      case 'ASSIGNED':
        return { label: 'Assigned', icon: UserCheck, className: 'ASSIGNED' };
      case 'PICKUP_IN_PROGRESS':
        return { label: 'In Progress', icon: Truck, className: 'PICKUP_IN_PROGRESS' };
      case 'COLLECTED':
        return { label: 'Collected', icon: PackageCheck, className: 'COLLECTED' };
      case 'IN_TRANSIT':
        return { label: 'In Transit', icon: ArrowRightLeft, className: 'IN_TRANSIT' };
      case 'RECEIVED_BY_RECYCLER':
        return { label: 'At Recycler', icon: Building2, className: 'RECEIVED_BY_RECYCLER' };
      case 'UNDER_PROCESSING':
        return { label: 'In Processing', icon: Cpu, className: 'UNDER_PROCESSING' };
      case 'PROCESSING_COMPLETED':
        return { label: 'Processed', icon: CheckCircle2, className: 'PROCESSING_COMPLETED' };
      case 'CERTIFICATE_ISSUED':
        return { label: 'Certified', icon: FileCheck2, className: 'CERTIFICATE_ISSUED' };
      case 'WEIGHT_DISCREPANCY':
        return { label: 'Weight Variance', icon: AlertTriangle, className: 'WEIGHT_DISCREPANCY' };
      case 'PICKUP_FAILED':
        return { label: 'Pickup Failed', icon: XCircle, className: 'PICKUP_FAILED' };
      case 'CANCELLED':
        return { label: 'Cancelled', icon: XCircle, className: 'CANCELLED' };
      case 'REQUIRES_REVIEW':
        return { label: 'Review Req.', icon: HelpCircle, className: 'REQUIRES_REVIEW' };
      default:
        return { label: status, icon: Clock, className: 'REQUESTED' };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span className={`status-badge ${config.className}`} style={size === 'sm' ? { fontSize: '10px', padding: '2px 6px' } : undefined}>
      <Icon size={size === 'sm' ? 11 : 13} />
      <span>{config.label}</span>
    </span>
  );
};

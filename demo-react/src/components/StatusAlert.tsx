/**
 * StatusAlert — renders an alert banner when `status` is non-null, nothing otherwise.
 *
 * Pages that hold a `status: StatusMessage | null` variable replace the repeated
 * conditional expression `{status && <div className={`alert alert-${status.type}`}>…</div>}`
 * with a single `<StatusAlert status={status} />` call.
 */
import React from 'react';

export type AlertType = 'success' | 'warning' | 'info' | 'error';

export interface StatusMessage {
  type: AlertType;
  msg: string;
}

interface StatusAlertProps {
  status: StatusMessage | null;
  style?: React.CSSProperties;
}

export default function StatusAlert({ status, style }: StatusAlertProps) {
  if (!status) return null;
  return (
    <div className={`alert alert-${status.type}`} style={style}>
      {status.msg}
    </div>
  );
}

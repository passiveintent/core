import React, { type ReactNode } from 'react';

interface Props {
  variant?: 'browser' | 'phone' | 'panel';
  title?: string;
  flat?: boolean;
  children: ReactNode;
}

export default function ShowcaseDevice({ variant = 'browser', title, flat, children }: Props) {
  return (
    <div
      className={`showcase-device${variant === 'phone' ? ' showcase-device-phone' : ''}${flat ? ' showcase-device-flat' : ''}`}
    >
      {(variant === 'browser' || variant === 'panel') && (
        <div className="showcase-browser-bar">
          <span />
          <span />
          <span />
          {title && <strong>{title}</strong>}
        </div>
      )}
      <div className="showcase-device-body">{children}</div>
    </div>
  );
}

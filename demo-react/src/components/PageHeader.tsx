/**
 * PageHeader — shared header block used by every demo page.
 *
 * Renders the hook-callout badge, page title, and description in a
 * consistent layout. Accepts `description` as ReactNode so pages can
 * include inline <strong>, <code>, etc. without breaking markup.
 */
import React, { type ReactNode } from 'react';

interface PageHeaderProps {
  /** The hook / API surface this page demonstrates, e.g. "⚛️ usePassiveIntent() — track()" */
  hook: string;
  title: string;
  description: ReactNode;
}

export default function PageHeader({ hook, title, description }: PageHeaderProps) {
  return (
    <div className="demo-header">
      <div className="hook-callout">{hook}</div>
      <h2 className="demo-title">{title}</h2>
      <p className="demo-description">{description}</p>
    </div>
  );
}

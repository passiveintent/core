import React, { type ReactNode } from 'react';

export interface TabDef<T extends string = string> {
  key: T;
  label: string;
}

interface Props<T extends string> {
  tabs: TabDef<T>[];
  active: T;
  onChange: (key: T) => void;
  children: ReactNode;
}

export default function ShowcaseTabs<T extends string>({
  tabs,
  active,
  onChange,
  children,
}: Props<T>) {
  return (
    <div>
      <div className="showcase-tab-bar" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={active === t.key}
            className={`showcase-tab${active === t.key ? ' active' : ''}`}
            onClick={() => onChange(t.key)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}

import React from 'react';

export interface ConsoleEntry {
  label: string;
  value: string;
  highlight?: boolean;
}

interface Props {
  title?: string;
  status?: string;
  scoreHigh?: { label: string; value: string; sub?: string };
  scoreLow?: { label: string; value: string; sub?: string };
  meterVariant?: 'green' | 'red' | 'yellow' | 'accent';
  entries?: ConsoleEntry[];
  children?: React.ReactNode;
}

export default function ShowcaseConsole({
  title = 'Intent Console',
  status = 'Live',
  scoreHigh,
  scoreLow,
  meterVariant = 'accent',
  entries = [],
  children,
}: Props) {
  return (
    <div className="showcase-console">
      <div className="showcase-console-head">
        <span>{title}</span>
        <span className="showcase-console-status">{status}</span>
      </div>
      <div className="showcase-console-body">
        {(scoreHigh || scoreLow) && (
          <div className="showcase-score-panel">
            {scoreHigh && (
              <div className="showcase-score-card showcase-score-high showcase-score-card-fade-high">
                <span>{scoreHigh.label}</span>
                <strong>{scoreHigh.value}</strong>
                {scoreHigh.sub && <small>{scoreHigh.sub}</small>}
              </div>
            )}
            {scoreLow && (
              <div className="showcase-score-card showcase-score-low showcase-score-card-fade-low">
                <span>{scoreLow.label}</span>
                <strong>{scoreLow.value}</strong>
                {scoreLow.sub && <small>{scoreLow.sub}</small>}
              </div>
            )}
          </div>
        )}
        {(scoreHigh || scoreLow) && (
          <div className="showcase-meter">
            <span
              className={`showcase-meter-fill showcase-meter-fill-${meterVariant} showcase-meter-animated`}
            />
          </div>
        )}
        {entries.map((e, i) => (
          <div className="showcase-console-row" key={i}>
            <span>{e.label}</span>
            <strong style={e.highlight ? { color: 'var(--accent-h)' } : undefined}>
              {e.value}
            </strong>
          </div>
        ))}
        {children}
      </div>
    </div>
  );
}

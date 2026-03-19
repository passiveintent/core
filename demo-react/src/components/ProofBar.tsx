import React from 'react';

const DEFAULT_PROOFS = ['<2ms latency', '11.4 kB payload', 'Zero-egress', '100% client-side'];

interface Props {
  items?: string[];
}

export default function ProofBar({ items = DEFAULT_PROOFS }: Props) {
  return (
    <div className="showcase-proof-bar">
      {items.map((item) => (
        <span key={item} className="showcase-proof-pill">
          {item}
        </span>
      ))}
    </div>
  );
}

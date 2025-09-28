import React, { useState, useEffect } from 'react';
export default function StarRating({ value = 0, onChange }) {
  const [rating, setRating] = useState(value);
  useEffect(() => setRating(value), [value]);
  return (
    <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} onClick={() => { setRating(s); onChange && onChange(s); }}
          style={{ cursor: 'pointer', fontSize: 18, color: s <= rating ? '#fbbf24' : '#3b485e' }}>
          ★
        </span>
      ))}
    </div>
  );
}

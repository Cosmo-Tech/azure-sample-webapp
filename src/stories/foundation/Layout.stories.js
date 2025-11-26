import React from 'react';

const LayoutGrid = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '8px',
      height: '80px',
    }}
  >
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        style={{
          background: '#EDEFF6',
          borderRadius: 4,
        }}
      />
    ))}
  </div>
);

export default {
  title: 'Foundation/Layout',
  component: LayoutGrid,
};

export const TwelveColumnGrid = {
  render: () => <LayoutGrid />,
};

import React from 'react';
import { Icons } from '../utils';

const IconsPreview = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '24px',
      padding: '24px',
    }}
  >
    {Icons.map(({ name, Icon }) => (
      <div
        key={name}
        style={{
          textAlign: 'center',
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <Icon size={32} strokeWidth={1.5} />
        <div style={{ marginTop: 8, fontSize: 12, fontWeight: '600' }}>{name}</div>
      </div>
    ))}
  </div>
);

export default {
  title: 'Foundation/Icons',
  component: IconsPreview,
};

export const AllIcons = {
  render: () => <IconsPreview />,
};

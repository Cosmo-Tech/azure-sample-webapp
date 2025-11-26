/* eslint-disable react/prop-types */
import React from 'react';
import paletteLight from '../../theme/custom/cosmoLight/palette';

const ColorBlock = ({ color }) => (
  <div
    style={{
      background: color,
      width: '52px',
      height: '52px',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
    }}
  />
);

const PaletteSection = ({ title, group }) => {
  const items = Object.entries(group);

  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>{title}</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '12px',
        }}
      >
        {items.map(([key, value]) => {
          if (typeof value !== 'string' || !value.match(/^#|rgb|hsl/)) return null;

          return (
            <div
              key={key}
              style={{
                background: '#fff',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <ColorBlock color={value} />
              <div>
                <strong>{key}</strong>
                <br />
                <span style={{ fontSize: '13px', color: '#555' }}>{value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PaletteViewer = () => (
  <div style={{ padding: '24px' }}>
    <PaletteSection title="Primary" group={paletteLight.primary} />
    <PaletteSection title="Secondary" group={paletteLight.secondary} />
    <PaletteSection title="Text" group={paletteLight.text} />
    <PaletteSection title="Error" group={paletteLight.error} />
    <PaletteSection title="Warning" group={paletteLight.warning} />
    <PaletteSection title="Info" group={paletteLight.info} />
    <PaletteSection title="Success" group={paletteLight.success} />
    <PaletteSection title="Background" group={paletteLight.background} />
    <PaletteSection title="Microsoft" group={paletteLight.microsoft} />
    <PaletteSection title="App Bar" group={paletteLight.appbar} />
    <PaletteSection title="Login" group={paletteLight.login} />

    <PaletteSection title="Navigation" group={paletteLight.navigation} />
  </div>
);

export default {
  title: 'Foundation/Colors',
};

export const AllColors = {
  render: () => <PaletteViewer />,
};

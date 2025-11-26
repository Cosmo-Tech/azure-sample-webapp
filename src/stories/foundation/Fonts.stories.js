/* eslint-disable react/prop-types */
import React from 'react';

const typography = {
  kpi: {
    label: 'KPI',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '32px',
    lineHeight: '2rem',
    fontWeight: 600,
  },
  kpiUnit: {
    label: 'KPI Unit',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '24px',
    lineHeight: '1.5rem',
    fontWeight: 600,
  },
  pageTitle: {
    label: 'Page Title',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '26px',
    lineHeight: '1.625rem',
    fontWeight: 700,
    letterSpacing: '-0.03em',
  },
  largeTitle: {
    label: 'Large Title',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '26px',
    lineHeight: '1.625rem',
    fontWeight: 600,
  },
  regularStrong: {
    label: 'Regular Strong',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '14px',
    lineHeight: '0.875rem',
    fontWeight: 600,
  },
  smallStrong: {
    label: 'Small Strong',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '12px',
    lineHeight: '0.75rem',
    fontWeight: 600,
  },
  small: {
    label: 'Small',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '12px',
    lineHeight: '0.75rem',
    fontWeight: 400,
  },
};

// Typography block component
const FontBlock = ({ label, settings }) => (
  <div
    style={{
      padding: '16px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      minWidth: '300px',
      background: '#fff',
    }}
  >
    <div style={{ marginBottom: '8px', color: '#4b4b4b', fontSize: '14px' }}>
      <strong>{label}</strong>
    </div>

    <div
      style={{
        fontFamily: settings.fontFamily,
        fontSize: settings.fontSize,
        lineHeight: settings.lineHeight,
        fontWeight: settings.fontWeight,
        letterSpacing: settings.letterSpacing || 'normal',
        marginBottom: '12px',
        color: '#292F33',
      }}
    >
      The quick brown fox jumps over the lazy dog.
    </div>

    <div style={{ fontSize: '12px', color: '#666' }}>
      <div>
        <strong>Font:</strong> {settings.fontFamily}
      </div>
      <div>
        <strong>Size:</strong> {settings.fontSize}
      </div>
      <div>
        <strong>Weight:</strong> {settings.fontWeight}
      </div>
      {settings.letterSpacing && (
        <div>
          <strong>Letter spacing:</strong> {settings.letterSpacing}
        </div>
      )}
    </div>
  </div>
);

// Story container
const Fonts = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      padding: '24px',
      maxWidth: '800px',
    }}
  >
    {Object.entries(typography).map(([key, settings]) => (
      <FontBlock key={key} label={settings.label} settings={settings} />
    ))}
  </div>
);

export default {
  title: 'Foundation/Fonts',
  component: Fonts,
};

export const Typography = {
  render: () => <Fonts />,
};

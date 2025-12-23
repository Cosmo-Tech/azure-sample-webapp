// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
// src/components/Icon/Icon.jsx
import * as Icons from 'lucide-react';
import React from 'react';
import PropTypes from 'prop-types';

export const Icon = ({ name, size = 16, color, className, strokeWidth = 1.5 }) => {
  const LucideIcon = Icons[name];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon size={size} color={color} strokeWidth={strokeWidth} className={className} />;
};

Icon.propTypes = {
  name: PropTypes.oneOf(Object.keys(Icons)).isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
  strokeWidth: PropTypes.number,
};

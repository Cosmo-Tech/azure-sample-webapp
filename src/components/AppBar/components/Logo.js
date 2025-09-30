// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useApplicationTheme } from '../../../state/app/hooks';
import { pictureDark, pictureLight } from '../../../theme';

export const Logo = () => {
  const { isDarkTheme } = useApplicationTheme();
  const logoPath = useMemo(
    () => `${process.env?.PUBLIC_URL ?? ''}${isDarkTheme ? pictureDark.darkLogo : pictureLight.lightLogo}`,
    [isDarkTheme]
  );
  return <img alt="Cosmo Tech" height="28px" src={logoPath} style={{ marginLeft: '8px', marginRight: '8px' }} />;
};

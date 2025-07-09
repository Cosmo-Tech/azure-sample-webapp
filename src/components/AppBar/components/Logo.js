// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import ConfigService from '../../../services/ConfigService';
import { useApplicationTheme } from '../../../state/app/hooks';
import { pictureDark, pictureLight } from '../../../theme';

export const Logo = () => {
  const { isDarkTheme } = useApplicationTheme();
  const publicUrl = ConfigService.getParameterValue('PUBLIC_URL') ?? '';
  const logoPath = useMemo(
    () => `${publicUrl}${isDarkTheme ? pictureDark.darkLogo : pictureLight.lightLogo}`,
    [isDarkTheme, publicUrl]
  );
  return <img alt="Cosmo Tech" height="28px" src={logoPath} style={{ marginLeft: '8px', marginRight: '8px' }} />;
};

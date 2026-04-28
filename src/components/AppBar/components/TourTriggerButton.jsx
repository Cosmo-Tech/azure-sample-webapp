// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import TourIcon from '@mui/icons-material/Tour';
import { IconButton, Tooltip } from '@mui/material';
import { useOnboardingTour } from '../../OnboardingTour';

export const TourTriggerButton = () => {
  const { t } = useTranslation();
  const tourContext = useOnboardingTour();

  if (!tourContext) return null;

  return (
    <Tooltip title={t('onboardingTour.triggerTooltip', 'Guided tour')}>
      <IconButton
        data-cy="onboarding-tour-trigger"
        onClick={tourContext.startTour}
        color="inherit"
        size="small"
        sx={{ mx: 0.5 }}
      >
        <TourIcon />
      </IconButton>
    </Tooltip>
  );
};

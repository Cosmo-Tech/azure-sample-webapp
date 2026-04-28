// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Joyride, ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useTheme } from '@mui/material/styles';
import { useOnboardingTour } from './OnboardingTourProvider';
import { getTourSteps } from './tourSteps';

const NAVIGATION_DELAY_MS = 400;

const getNextIndex = (action, index) => (action === ACTIONS.PREV ? index - 1 : index + 1);

export const OnboardingTour = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const { isTourRunning, stepIndex, setStepIndex, stopTour, startTour, hasSeenTour } = useOnboardingTour();

  const steps = useMemo(() => getTourSteps(t), [t]);

  // Auto-start tour on first visit
  useEffect(() => {
    if (!hasSeenTour() && workspaceId) {
      const timer = setTimeout(() => startTour(), 800);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTour, workspaceId, startTour]);

  const navigateToTab = useCallback(
    (tab) => {
      if (workspaceId && tab) {
        navigate(`/${workspaceId}/${tab}`);
      }
    },
    [navigate, workspaceId]
  );

  const getCurrentTab = useCallback(() => {
    const path = globalThis.location.pathname;
    const segments = path.split('/').filter(Boolean);
    return segments.length >= 2 ? segments.at(-1) : null;
  }, []);

  const advanceToStep = useCallback(
    (nextIndex, requiredTab, controls) => {
      const currentTab = getCurrentTab();
      if (requiredTab && currentTab !== requiredTab) {
        navigateToTab(requiredTab);
        setTimeout(() => setStepIndex(nextIndex), NAVIGATION_DELAY_MS);
      } else {
        setStepIndex(nextIndex);
      }
    },
    [getCurrentTab, navigateToTab, setStepIndex]
  );

  const handleEvent = useCallback(
    (data, controls) => {
      const { action, index, status, type } = data;

      if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
        stopTour();
        return;
      }

      if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
        const nextIndex = getNextIndex(action, index);
        if (nextIndex < 0 || nextIndex >= steps.length) {
          stopTour();
          return;
        }
        const requiredTab = steps[nextIndex].tab;
        advanceToStep(nextIndex, requiredTab, controls);
      }
    },
    [steps, advanceToStep, stopTour]
  );

  const joyrideStyles = useMemo(
    () => ({
      options: {
        arrowColor: theme.palette.background.paper,
        backgroundColor: theme.palette.background.paper,
        overlayColor: 'rgba(0, 0, 0, 0.6)',
        primaryColor: theme.palette.primary.main,
        textColor: theme.palette.text.primary,
        zIndex: 10000,
      },
      tooltip: {
        borderRadius: theme.shape.borderRadius * 2,
        padding: theme.spacing(2),
      },
      tooltipContainer: {
        textAlign: 'left',
      },
      tooltipTitle: {
        fontSize: '1.1rem',
        fontWeight: 600,
        marginBottom: theme.spacing(1),
      },
      tooltipContent: {
        fontSize: '0.9rem',
        lineHeight: 1.5,
      },
      buttonNext: {
        backgroundColor: theme.palette.primary.main,
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.primary.contrastText,
        fontSize: '0.85rem',
        padding: `${theme.spacing(0.75)} ${theme.spacing(2)}`,
      },
      buttonBack: {
        color: theme.palette.text.secondary,
        fontSize: '0.85rem',
        marginRight: theme.spacing(1),
      },
      buttonSkip: {
        color: theme.palette.text.secondary,
        fontSize: '0.85rem',
      },
      buttonClose: {
        color: theme.palette.text.secondary,
      },
      spotlight: {
        borderRadius: theme.shape.borderRadius,
      },
    }),
    [theme]
  );

  const locale = useMemo(
    () => ({
      back: t('onboardingTour.buttons.back', 'Back'),
      close: t('onboardingTour.buttons.close', 'Close'),
      last: t('onboardingTour.buttons.finish', 'Finish'),
      next: t('onboardingTour.buttons.next', 'Next'),
      open: t('onboardingTour.buttons.open', 'Open the dialog'),
      skip: t('onboardingTour.buttons.skip', 'Skip tour'),
    }),
    [t]
  );

  if (!isTourRunning) return null;

  return (
    <Joyride
      steps={steps}
      stepIndex={stepIndex}
      run={isTourRunning}
      continuous
      showSkipButton
      showProgress
      disableOverlayClose
      spotlightClicks={false}
      onEvent={handleEvent}
      styles={joyrideStyles}
      locale={locale}
      floaterProps={{
        disableAnimation: true,
      }}
    />
  );
};

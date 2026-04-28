// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const STORAGE_KEY = 'hasSeenOnboardingTour';

const OnboardingTourContext = createContext(null);

export const useOnboardingTour = () => {
  return useContext(OnboardingTourContext);
};

export const OnboardingTourProvider = ({ children }) => {
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const hasSeenTour = useCallback(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }, []);

  const markTourAsSeen = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const startTour = useCallback(() => {
    setStepIndex(0);
    setIsTourRunning(true);
  }, []);

  const stopTour = useCallback(() => {
    setIsTourRunning(false);
    setStepIndex(0);
    markTourAsSeen();
  }, [markTourAsSeen]);

  const value = useMemo(
    () => ({
      isTourRunning,
      stepIndex,
      setStepIndex,
      startTour,
      stopTour,
      hasSeenTour,
      markTourAsSeen,
    }),
    [isTourRunning, stepIndex, startTour, stopTour, hasSeenTour, markTourAsSeen]
  );

  return <OnboardingTourContext.Provider value={value}>{children}</OnboardingTourContext.Provider>;
};

OnboardingTourProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useSolutionParameters } from '../state/hooks/SolutionHooks';
import { TranslationUtils, ParameterConstraintsUtils } from '../utils';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import isSameDay from 'date-fns/isSameDay';
import { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const useParameterConstraint = (parameterData) => {
  const { t } = useTranslation();
  const parametersList = useSolutionParameters();
  const { trigger, watch } = useFormContext();
  const constraint = ParameterConstraintsUtils.getParameterValidationConstraint(
    parameterData?.options?.validation,
    parameterData.varType,
    parametersList
  );
  const constrainingValue = constraint ? watch(constraint?.id) : undefined;

  useEffect(() => {
    if (constraint) {
      trigger(parameterData.id);
    }
  }, [constraint, parameterData.id, trigger, constrainingValue]);
  return { t, constraint, constrainingValue };
};

export const useDateConstraintValidation = (parameterData) => {
  const { t, constraint, constrainingValue } = useParameterConstraint(parameterData);

  const getDateConstraintValidation = useCallback(
    (value) => {
      const getTranslationLabel = (translationString, fallbackString) => {
        return t(translationString, fallbackString, {
          field: t(TranslationUtils.getParameterTranslationKey(parameterData?.id)),
          constraint: t(TranslationUtils.getParameterTranslationKey(constraint?.id)),
        });
      };

      if (constraint) {
        switch (constraint.operator) {
          case '>':
            return (
              isAfter(new Date(value), new Date(constrainingValue)) ||
              getTranslationLabel(
                'views.scenario.scenarioParametersValidationErrors.after',
                'The field {{field}} must be strictly after the field {{constraint}}'
              )
            );
          case '<':
            return (
              isBefore(new Date(value), new Date(constrainingValue)) ||
              getTranslationLabel(
                'views.scenario.scenarioParametersValidationErrors.before',
                'The field {{field}} must be strictly before the field {{constraint}}'
              )
            );
          case '>=':
            return (
              !isBefore(new Date(value), new Date(constrainingValue)) ||
              getTranslationLabel(
                'views.scenario.scenarioParametersValidationErrors.afterOrEqual',
                'The field {{field}} must be after or equal to the field {{constraint}}'
              )
            );
          case '<=':
            return (
              !isAfter(new Date(value), new Date(constrainingValue)) ||
              getTranslationLabel(
                'views.scenario.scenarioParametersValidationErrors.beforeOrEqual',
                'The field {{field}} must be before or equal to the field {{constraint}}'
              )
            );
          case '==':
            return (
              isSameDay(new Date(value), new Date(constrainingValue)) ||
              getTranslationLabel(
                'views.scenario.scenarioParametersValidationErrors.equalDate',
                'The field {{field}} must be equal to the field {{constraint}}'
              )
            );
          case '!=':
            return (
              !isSameDay(new Date(value), new Date(constrainingValue)) ||
              getTranslationLabel(
                'views.scenario.scenarioParametersValidationErrors.differentDate',
                'The field {{field}} must be different from the field {{constraint}}'
              )
            );
          default:
            return true;
        }
      }
      return true;
    },
    [constrainingValue, constraint, t, parameterData?.id]
  );
  return { getDateConstraintValidation };
};

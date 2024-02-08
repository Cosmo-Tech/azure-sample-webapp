// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isSameDay from 'date-fns/isSameDay';
import { useSolutionParameters } from '../state/hooks/SolutionHooks';
import { TranslationUtils, ParameterConstraintsUtils } from '../utils';

export const useParameterConstraint = (parameterData) => {
  const { t } = useTranslation();

  const parametersList = useSolutionParameters();
  const { trigger } = useFormContext();

  const constraint = ParameterConstraintsUtils.getParameterValidationConstraint(
    parameterData?.options?.validation,
    parameterData.varType,
    parametersList
  );

  const constrainingValue = useWatch({ name: constraint?.id });

  const getTranslationLabel = (translationString, fallbackString) => {
    return t(translationString, fallbackString, {
      field: t(TranslationUtils.getParameterTranslationKey(parameterData?.id)),
      constraint: t(TranslationUtils.getParameterTranslationKey(constraint?.id)),
    });
  };

  useEffect(() => {
    if (constraint) {
      trigger(parameterData.id);
    }
  }, [constraint, parameterData.id, trigger, constrainingValue]);
  return { getTranslationLabel, constraint, constrainingValue };
};

export const useDateConstraintValidation = (parameterData) => {
  const { getTranslationLabel, constraint, constrainingValue } = useParameterConstraint(parameterData);

  const getDateConstraintValidation = useCallback(
    (value) => {
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
                'views.scenario.scenarioParametersValidationErrors.equalTo',
                'The field {{field}} must be equal to the field {{constraint}}'
              )
            );
          case '!=':
            return (
              !isSameDay(new Date(value), new Date(constrainingValue)) ||
              getTranslationLabel(
                'views.scenario.scenarioParametersValidationErrors.differentFrom',
                'The field {{field}} must be different from the field {{constraint}}'
              )
            );
          default:
            return true;
        }
      }
      return true;
    },
    [constrainingValue, constraint, getTranslationLabel]
  );
  return { getDateConstraintValidation };
};

export const useParameterConstraintValidation = (parameterData) => {
  const { getTranslationLabel, constraint, constrainingValue } = useParameterConstraint(parameterData);
  const getParameterConstraintValidation = useCallback(
    (value) => {
      if (constraint) {
        switch (constraint.operator) {
          case '>':
            return (
              value > constrainingValue ||
              getTranslationLabel(
                'views.scenario.scenarioParametersValidationErrors.greaterThan',
                'The field {{field}} must be greater than the field {{constraint}}'
              )
            );
          case '<':
            return (
              value < constrainingValue ||
              getTranslationLabel(
                'views.scenario.scenarioParametersValidationErrors.lessThan',
                'The field {{field}} must be less than the field {{constraint}}'
              )
            );
          case '>=':
            return (
              value >= constrainingValue ||
              getTranslationLabel(
                'views.scenario.scenarioParametersValidationErrors.greaterThanOrEqual',
                'The field {{field}} must be greater than or equal to the field {{constraint}}'
              )
            );
          case '<=':
            return (
              value <= constrainingValue ||
              getTranslationLabel(
                'views.scenario.scenarioParametersValidationErrors.lessThanOrEqual',
                'The field {{field}} must be less than or equal to the field {{constraint}}'
              )
            );
          case '!=':
            return (
              value !== constrainingValue ||
              getTranslationLabel(
                'views.scenario.scenarioParametersValidationErrors.differentFrom',
                'The field {{field}} must be different from the field {{constraint}}'
              )
            );
          case '==':
            return (
              value === constrainingValue ||
              getTranslationLabel(
                'views.scenario.scenarioParametersValidationErrors.equalTo',
                'The field {{field}} must be equal to the field {{constraint}}'
              )
            );
          default:
            return true;
        }
      }
      return true;
    },
    [constrainingValue, constraint, getTranslationLabel]
  );
  return { getParameterConstraintValidation };
};

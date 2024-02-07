// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

const MockFormProvider = ({ children }) => {
  const formMethods = useForm();
  const formProps = { ...formMethods };
  return <FormProvider {...formProps}>{children}</FormProvider>;
};

MockFormProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default MockFormProvider;

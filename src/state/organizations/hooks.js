// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useSelector } from 'react-redux';

export const useOrganization = () => {
  return useSelector((state) => state.organization.current);
};

export const useOrganizationData = () => {
  return useSelector((state) => state.organization.current?.data);
};

export const useOrganizationId = () => {
  return useSelector((state) => state.organization.current?.data?.id);
};

export const useOrganizationName = () => {
  return useSelector((state) => state.organization.current?.data?.name);
};

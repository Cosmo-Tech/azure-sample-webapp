// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dispatchLogIn, dispatchLogOut } from '../dispatchers/auth/AuthDispatcher';

export const useAuthStatus = () => {
  return useSelector((state) => state.auth.status);
};

export const useUserAppPermissions = () => {
  return useSelector((state) => state.auth.permissions);
};

export const useUserAppRoles = () => {
  return useSelector((state) => state.auth.roles);
};

export const useUser = () => {
  return useSelector((state) => state.auth);
};

export const useUserId = () => {
  return useSelector((state) => state.auth.userId);
};

export const useUserName = () => {
  return useSelector((state) => state.auth.userName);
};

export const useUserEmail = () => {
  return useSelector((state) => state.auth.userEmail);
};

export const useUserProfilePic = () => {
  return useSelector((state) => state.auth.profilePic);
};

export const useLogIn = () => {
  const dispatch = useDispatch();
  return useCallback((authProvider) => dispatch(dispatchLogIn(authProvider)), [dispatch]);
};

export const useLogOut = () => {
  const dispatch = useDispatch();
  return useCallback((data) => dispatch(dispatchLogOut(data)), [dispatch]);
};

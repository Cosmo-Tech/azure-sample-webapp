// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Routes, Navigate, Route, useNavigationType } from 'react-router-dom';
import { TabLayout } from './layouts';
import Workspaces from './views/Workspaces';
import { useWorkspaceId } from './state/hooks/WorkspaceHooks';
import { getAllTabs } from './AppLayout';
import { UserStatusGate } from './components';

const AppRoutes = () => {
  const navigationType = useNavigationType();
  const providedUrl = sessionStorage.getItem('providedUrl');
  const providedUrlBeforeSignIn = sessionStorage.getItem('providedUrlBeforeSignIn');
  const currentWorkspaceId = useWorkspaceId();
  const tabs = getAllTabs();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={providedUrlBeforeSignIn || providedUrl || '/workspaces'} replace />} />
      <Route
        path="/workspaces"
        element={
          <UserStatusGate>
            {currentWorkspaceId && navigationType !== 'POP' ? (
              <Navigate to={`/${currentWorkspaceId}/scenario`} />
            ) : (
              <Workspaces />
            )}
          </UserStatusGate>
        }
      />
      <Route
        path=":workspaceId"
        element={
          <UserStatusGate>
            <Navigate to="scenario" replace />
          </UserStatusGate>
        }
      />
      <Route
        element={
          <UserStatusGate>
            <TabLayout tabs={tabs} />
          </UserStatusGate>
        }
      >
        {tabs?.map((tab) => (
          <Route key={tab.key} path={`:workspaceId/${tab.to}`} element={<UserStatusGate>{tab.render}</UserStatusGate>}>
            {['scenario', 'instance'].includes(tab.to) && (
              <Route path=":scenarioId" element={<UserStatusGate>{tab.render}</UserStatusGate>} />
            )}
          </Route>
        ))}
      </Route>
      <Route
        path="/sign-in"
        element={
          <UserStatusGate>
            <Navigate to={providedUrlBeforeSignIn || providedUrl || '/workspaces'} />
          </UserStatusGate>
        }
      />
      <Route
        path="/accessDenied"
        element={
          <UserStatusGate>
            <Navigate to="/workspaces" />
          </UserStatusGate>
        }
      />
      <Route path="*" element={<Navigate to={'/workspaces'} />} />
    </Routes>
  );
};

export default AppRoutes;

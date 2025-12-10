// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { Navigate, Route, createBrowserRouter, RouterProvider, createRoutesFromElements } from 'react-router-dom';
import { getAllTabs } from './AppLayout';
import { UserStatusGate } from './components/UserStatusGate';
import { TabLayout } from './layouts';
import ConfigService from './services/ConfigService';
import { RouterUtils } from './utils';
import DatasetListingView from './views/DatasetListing';
import ScenariosListingView from './views/ScenariosListing';
import Workspaces from './views/Workspaces';

const AppRoutes = () => {
  const providedUrl = sessionStorage.getItem('providedUrl');
  const providedUrlBeforeSignIn = sessionStorage.getItem('providedUrlBeforeSignIn');
  const redirectPath = RouterUtils.getLocationRelativePath(providedUrlBeforeSignIn ?? providedUrl ?? '/workspaces');
  const publicUrl = ConfigService.getParameterValue('PUBLIC_URL') ?? '';
  const tabs = getAllTabs();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          element={
            <UserStatusGate>
              <TabLayout />
            </UserStatusGate>
          }
        >
          <Route
            path="/workspaces"
            element={
              <UserStatusGate>
                <Workspaces />
              </UserStatusGate>
            }
          />
        </Route>
        <Route
          path=":workspaceId"
          element={
            <UserStatusGate>
              <Navigate to="scenarios" replace />
            </UserStatusGate>
          }
        />
        <Route
          element={
            <UserStatusGate>
              <TabLayout />
            </UserStatusGate>
          }
        >
          <Route
            path=":workspaceId/datasets"
            element={
              <UserStatusGate>
                <DatasetListingView />
              </UserStatusGate>
            }
          />
          <Route
            path=":workspaceId/scenarios"
            element={
              <UserStatusGate>
                <ScenariosListingView />
              </UserStatusGate>
            }
          />
          {tabs?.map((tab) => (
            <Route
              key={tab.key}
              path={`:workspaceId/${tab.to}`}
              element={<UserStatusGate>{tab.render}</UserStatusGate>}
            >
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
              <Navigate to={redirectPath} />
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
      </>
    ),
    {
      basename: publicUrl,
      future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true,
        v7_startTransition: true,
      },
    }
  );

  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
};

export default AppRoutes;

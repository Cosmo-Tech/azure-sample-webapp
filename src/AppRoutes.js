// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { Navigate, Route, createBrowserRouter, RouterProvider, createRoutesFromElements } from 'react-router-dom';
import { MainPage } from './components/MainPage/MainPage';
import { UserStatusGate } from './components/UserStatusGate';
import { TabLayout } from './layouts';
import ConfigService from './services/ConfigService';
import { RouterUtils } from './utils';
import DatasetListingView from './views/DatasetListing';
import { Error403, Error404 } from './views/Errors';
import ScenariosListingView from './views/ScenariosListing';
import Workspaces from './views/Workspaces';

const AppRoutes = () => {
  const providedUrl = sessionStorage.getItem('providedUrl');
  const providedUrlBeforeSignIn = sessionStorage.getItem('providedUrlBeforeSignIn');
  const redirectPath = RouterUtils.getLocationRelativePath(providedUrlBeforeSignIn ?? providedUrl ?? '/workspaces');
  const publicUrl = ConfigService.getParameterValue('PUBLIC_URL') ?? '';

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Navigate to="/workspaces" replace />} />

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
            path=":workspaceId/data"
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

          <Route path=":workspaceId/scenario/:scenarioId" element={<MainPage />} />
        </Route>

        <Route
          path="/sign-in"
          element={
            <UserStatusGate>
              <Navigate to={redirectPath} />
            </UserStatusGate>
          }
        />

        <Route path="/403" element={<Error403 />} />
        <Route path="/404" element={<Error404 />} />

        <Route path="*" element={<Navigate to={'/404'} />} />
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

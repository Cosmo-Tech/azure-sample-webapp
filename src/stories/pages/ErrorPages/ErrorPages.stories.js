// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { Link } from '@mui/material';
import { ErrorPage } from '../../../components/ErrorPage';

export default {
  title: 'Views/Errors',
  component: ErrorPage,
};

export const Error404 = () => (
  <ErrorPage
    code="404"
    title="Page Not Found"
    description="The page you are looking for does not exist."
    onBack={() => alert('Back clicked')}
    backLabel="Back"
    homeLabel="Home"
  />
);

export const Error500 = () => (
  <ErrorPage
    code="500"
    title="Internal Server Error"
    description="An unexpected error occurred on the server."
    showBack={false}
    homeLabel="Home"
  >
    <Link href="#" sx={{ textDecoration: 'none', fontSize: 12 }}>
      Report this issue
    </Link>
  </ErrorPage>
);

export const Error503 = () => (
  <ErrorPage
    code="503"
    title="Service Unavailable"
    description="The service is temporarily unavailable. Please try again later."
    onBack={() => alert('Back clicked')}
    backLabel="Back"
    homeLabel="Home"
  >
    <Link href="#" sx={{ textDecoration: 'none', fontSize: 12 }}>
      Report this issue
    </Link>
  </ErrorPage>
);

export const Error403 = () => (
  <ErrorPage
    code="403"
    title="Access Denied"
    description="You do not have permission to view this page."
    onBack={() => alert('Back clicked')}
    backLabel="Back"
    homeLabel="Home"
  />
);

// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import { AppBar } from '../../components/AppBar';
import { useNavigate } from 'react-router-dom';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ResourceCard, ErrorBanner } from '@cosmotech/ui';
import { useWorkspaces } from './WorkspacesHook';
import { useApplicationError, useClearApplicationErrorMessage } from '../../state/hooks/ApplicationHooks';
import { useResetCurrentWorkspace } from '../../state/hooks/WorkspaceHooks';

const Workspaces = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { workspacesList, organizationName, selectWorkspace } = useWorkspaces();
  const applicationError = useApplicationError();
  const clearApplicationErrorMessage = useClearApplicationErrorMessage();
  sessionStorage.removeItem('providedUrlBeforeSignIn');

  const labels = {
    openButtonWorkspaceCard: t('genericcomponent.workspaceselector.card.button.open', 'Open'),
    titleNoWorkspacePlaceholder: t(
      'genericcomponent.workspaceselector.placeholder.noworkspace.title',
      'No workspace available'
    ),
    reasonNoWorkspacePlaceholder: t(
      'genericcomponent.workspaceselector.placeholder.noworkspace.description.reason',
      `This could mean you don't have permission to access existing workspaces.`
    ),
    contactNoWorkspacePlaceholder: t(
      'genericcomponent.workspaceselector.placeholder.noworkspace.description.contact',
      `If you think this is a mistake, please contact your administrator.`
    ),
  };
  const openWorkspace = (workspaceId) => {
    selectWorkspace(workspaceId);
    navigate(`/${workspaceId}`);
  };
  const resetWorkspace = useResetCurrentWorkspace();
  useEffect(() => {
    resetWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const workspaceListRender = workspacesList.data.map((workspace) => (
    <Grid item key={workspace.id}>
      <ResourceCard
        id={workspace.id}
        name={workspace.name}
        description={workspace.description}
        action={{
          label: labels.openButtonWorkspaceCard,
          callback: () => openWorkspace(workspace.id),
        }}
      />
    </Grid>
  ));

  return (
    <>
      <AppBar />
      {applicationError && (
        <ErrorBanner
          error={applicationError}
          labels={{
            dismissButtonText: t('commoncomponents.banner.button.dismiss', 'Dismiss'),
            tooLongErrorMessage: t(
              'commoncomponents.banner.tooLongErrorMessage',
              // eslint-disable-next-line max-len
              'Detailed error message is too long to be displayed. To read it, please use the COPY button and paste it in your favorite text editor.'
            ),
            secondButtonText: t('commoncomponents.banner.button.copy.label', 'Copy'),
            toggledButtonText: t('commoncomponents.banner.button.copy.copied', 'Copied'),
          }}
          clearErrors={clearApplicationErrorMessage}
        />
      )}
      <div data-cy="workspaces-view">
        {workspacesList?.data?.length === 0 ? (
          <Grid container justifyContent="center" alignItems="center" style={{ padding: '18px', height: '90%' }}>
            <Grid data-cy="no-workspace-placeholder" item xs={5} align="center">
              <Typography variant="h3" gutterBottom={true}>
                {labels.titleNoWorkspacePlaceholder}
              </Typography>
              <Typography display="block" variant="caption" color="textSecondary">
                {labels.reasonNoWorkspacePlaceholder}
              </Typography>
              <Typography display="block" variant="caption" color="textSecondary">
                {labels.contactNoWorkspacePlaceholder}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Grid container justifyContent="center" style={{ padding: '18px', height: '90%' }}>
            <Grid item xs={12}>
              <Accordion defaultExpanded={true}>
                <AccordionSummary>
                  <Typography variant="body1">{organizationName}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container item justifyContent="flex-start" spacing={2} style={{ padding: '24px' }}>
                    {workspaceListRender}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        )}
      </div>
    </>
  );
};

export default Workspaces;

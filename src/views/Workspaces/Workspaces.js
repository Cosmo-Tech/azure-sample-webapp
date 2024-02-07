// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ResourceCard, ErrorBanner } from '@cosmotech/ui';
import { AppBar } from '../../components/AppBar';
import { STATUSES } from '../../state/commons/Constants';
import { useApplicationError, useClearApplicationErrorMessage } from '../../state/hooks/ApplicationHooks';
import { useResetCurrentSolution, useSolution } from '../../state/hooks/SolutionHooks';
import { useResetCurrentWorkspace } from '../../state/hooks/WorkspaceHooks';
import { useWorkspaces } from './WorkspacesHook';

const Workspaces = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { workspacesList, organizationName, currentWorkspace } = useWorkspaces();
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
  const openWorkspace = useCallback(
    (workspaceId) => {
      navigate(`/${workspaceId}`);
    },
    [navigate]
  );

  const resetWorkspace = useResetCurrentWorkspace();
  const resetCurrentSolution = useResetCurrentSolution();
  const currentSolution = useSolution();
  const isLoaded = useRef(false);
  useEffect(() => {
    if (!isLoaded.current) {
      isLoaded.current = true;
      if (
        currentWorkspace?.status !== STATUSES.ERROR &&
        workspacesList?.data?.length === 1 &&
        currentSolution?.status !== STATUSES.ERROR
      ) {
        openWorkspace(workspacesList?.data[0].id);
      } else {
        resetWorkspace();
        resetCurrentSolution();
      }
    }
  }, [
    currentWorkspace?.status,
    openWorkspace,
    resetWorkspace,
    workspacesList?.data,
    resetCurrentSolution,
    currentSolution,
  ]);

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
        style={{ backgroundColor: '#ffffff08' }}
      />
    </Grid>
  ));

  return (
    <>
      <AppBar />
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
              {/* Keep Accordion always open while we have only one organization, and reset default cursor */}
              <Accordion expanded={true} sx={{ '& .MuiAccordionSummary-root:hover': { cursor: 'default !important' } }}>
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

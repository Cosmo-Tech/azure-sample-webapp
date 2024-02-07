// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid, List, ListItem, Typography } from '@mui/material';
import ConfigService from '../../services/ConfigService';
import { useSolutionData } from '../../state/hooks/SolutionHooks';
import { useWorkspaceData } from '../../state/hooks/WorkspaceHooks';

export const TechnicalInfoContent = () => {
  const { t } = useTranslation();
  const solutionData = useSolutionData();
  const solutionName = solutionData?.name ?? '';
  const solutionDescription = solutionData?.description ?? '';
  const currentWorkspace = useWorkspaceData();

  const technicalInformation = [
    {
      id: 'webappVersion',
      label: t('genericcomponent.dialog.technicalInfo.webAppVersion', 'Webapp version'),
      content: ConfigService.getParameterValue('APP_VERSION'),
    },
    {
      id: 'registryName',
      label: t('genericcomponent.dialog.technicalInfo.repositoryName', 'Container registry repository name'),
      content: solutionData?.repository,
    },
    {
      id: 'registryTag',
      label: t('genericcomponent.dialog.technicalInfo.repositoryTag', 'Container registry repository tag'),
      content: solutionData?.version,
    },
    {
      id: 'SDKVersion',
      label: t('genericcomponent.dialog.technicalInfo.sdkVersion', 'SDK version'),
      content: solutionData?.sdkVersion,
    },
  ];

  const infoToDisplay = currentWorkspace
    ? technicalInformation
    : technicalInformation.filter((infoItem) => ['webappVersion'].includes(infoItem.id));

  const copyInfoToClipboard = () => {
    const notAvailableEntry = t('genericcomponent.dialog.technicalInfo.notAvailableEntry');
    const infoToDisplayList = infoToDisplay
      .map((infoItem) => `${infoItem.label} ` + (infoItem.content ?? `${notAvailableEntry} (${infoItem.content})`))
      .join('\n');
    navigator.clipboard.writeText(solutionName + '\n' + solutionDescription + '\n' + infoToDisplayList);
  };

  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        {solutionName && (
          <Typography data-cy="technical-info-solution-name" gutterBottom sx={{ fontWeight: '700' }}>
            {solutionName}
          </Typography>
        )}
        {solutionDescription && (
          <Typography data-cy="technical-info-solution-description" variant="body2">
            {solutionDescription}
          </Typography>
        )}
      </Grid>
      <Grid item>
        <Typography gutterBottom={false}>{t('genericcomponent.dialog.technicalInfo.details', 'Details')}</Typography>
        <List dense disablePadding>
          {infoToDisplay.map((infoItem, index) => (
            <ListItem
              key={index}
              sx={{ display: 'list-item', listStyleType: 'disc', listStylePosition: 'inside' }}
              dense
            >
              <Typography component="span">{`${infoItem.label} `}</Typography>
              <Typography component="span" sx={{ fontWeight: 'bold' }}>
                {infoItem.content ?? (
                  <>
                    <i>{t('genericcomponent.dialog.technicalInfo.notAvailableEntry')}</i> {`(${infoItem.content})`}
                  </>
                )}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Button size="small" variant="outlined" color="inherit" sx={{ mt: 2 }} onClick={() => copyInfoToClipboard()}>
          {t('genericcomponent.dialog.technicalInfo.copyButton', 'Copy to clipboard')}
        </Button>
      </Grid>
    </Grid>
  );
};

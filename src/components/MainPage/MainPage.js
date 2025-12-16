// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { PlaySquare, SquarePen, SquarePlus } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Box, Button } from '@mui/material';
import { format } from 'date-fns';
import { useApp } from '../../AppHook';
import { SubNavigation } from '../../components/Subnavigation/SubNavigation';
import { STATUSES } from '../../services/config/StatusConstants';
import { TranslationUtils } from '../../utils';
import Loading from '../../views/Loading';
import { useScenario } from '../../views/Scenario/ScenarioHook';
import { getScenarioManagerLabels } from '../../views/ScenarioManager/labels';
import { PageHeader } from '../PageHeader';
import { useMainPage } from './MainPageHook';

export const MainPage = () => {
  const { t } = useTranslation();
  const { tabs } = useMainPage();
  const labels = getScenarioManagerLabels(t);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const { currentScenarioData } = useScenario();
  const { applicationStatus } = useApp();

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    try {
      return format(new Date(timestamp), 'do MMM yyyy');
    } catch {
      return '-';
    }
  };

  const isLoading = useMemo(() => [STATUSES.LOADING, STATUSES.IDLE].includes(applicationStatus), [applicationStatus]);

  return isLoading ? (
    <Loading />
  ) : (
    <Stack
      direction="column"
      sx={{
        padding: 2,
        backgroundColor: (theme) => theme.palette.background.background01.main,
      }}
    >
      <PageHeader
        title={currentScenarioData?.name}
        createdLabel={`${labels.created}:`}
        createdDate={formatDate(currentScenarioData?.createInfo?.timestamp)}
        runTypeLabel={`${t('views.scenario.text.scenariotype')}:`}
        runTypeValue={t(
          TranslationUtils.getRunTemplateTranslationKey(currentScenarioData.runTemplateId),
          currentScenarioData.runTemplateName
        )}
        actions={[
          <Button
            key="edit"
            startIcon={<SquarePen size={16} />}
            sx={{ backgroundColor: (theme) => theme.palette.neutral.neutral04.main }}
            variant="default"
            state="enabled"
          >
            {t('commoncomponents.button.scenario.parameters.addEdit', 'Add/Edit')}
          </Button>,
          <Button
            key="run"
            startIcon={<PlaySquare size={16} />}
            variant="highlighted"
            sx={{ backgroundColor: (theme) => theme.palette.primary.main }}
          >
            {t('commoncomponents.button.run.scenario.text, Run scenario')}
          </Button>,
          <Button
            key="new"
            startIcon={<SquarePlus size={16} />}
            sx={{ backgroundColor: (theme) => theme.palette.neutral.neutral04.main }}
            variant="default"
            state="enabled"
          >
            {t('commoncomponents.button.scenario.parameters.new', 'New')}
          </Button>,
        ]}
      />
      <SubNavigation
        tabs={tabs}
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={setSelectedTabIndex}
        alignLastTabRight
      />
      <Box sx={{ backgroundColor: (theme) => theme.palette.neutral.neutral04.main, borderRadius: 1, padding: 2 }}>
        {tabs.map((tab, index) => (
          <Box key={tab.key} sx={{ display: selectedTabIndex === index ? 'block' : 'none' }}>
            {tab.render}
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

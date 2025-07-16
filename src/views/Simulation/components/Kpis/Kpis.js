// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { Stack } from '@mui/material';
import KpiCard from './KpiCard';
import { useKpis } from './KpisHook';

const Kpis = () => {
  const { scenarioKpis } = useKpis();

  return (
    <div style={{ padding: '0px 8px' }}>
      <Stack direction="row" spacing={2} sx={{ mx: 1, justifyContent: 'space-evenly', alignItems: 'stretch' }}>
        {Object.entries(scenarioKpis).map(([kpiId, kpiData]) => (
          <KpiCard key={kpiId} kpi={kpiData} />
        ))}
      </Stack>
    </div>
  );
};

export default Kpis;

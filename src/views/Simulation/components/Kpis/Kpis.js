// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { Stack } from '@mui/material';
import KpiCard from './KpiCard';
import { useKpis } from './KpisHook';

const Kpis = () => {
  const { scenarioKpis } = useKpis();

  const cards = useMemo(
    () => Object.entries(scenarioKpis).map(([kpiId, kpiData]) => <KpiCard key={kpiId} kpi={kpiData} />),
    [scenarioKpis]
  );

  return (
    <div style={{ padding: '0px 8px' }}>
      <Stack direction="row" spacing={2} sx={{ mx: 1, justifyContent: 'space-evenly', alignItems: 'stretch' }}>
        {cards}
      </Stack>
    </div>
  );
};

export default Kpis;

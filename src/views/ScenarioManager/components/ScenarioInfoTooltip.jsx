// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Chip, Grid, Popover, Stack, Typography } from '@mui/material';

export const ScenarioInfoTooltip = ({ scenario }) => {
  const { t } = useTranslation();
  const [isPopoverOpened, setIsPopoverOpened] = useState(false);
  const anchorElement = useRef(null);

  const openPopover = () => setIsPopoverOpened(true);
  const closePopover = () => setIsPopoverOpened(false);

  const description = scenario?.description ? (
    <Typography
      data-cy="scenario-info-description"
      variant="body2"
      sx={{
        maxWidth: '500px',
        overflow: 'auto',
      }}
    >
      {scenario?.description}
    </Typography>
  ) : (
    <Typography
      data-cy="scenario-info-no-description-placeholder"
      variant="body2"
      sx={{ color: (theme) => theme.palette.appbar.contrastTextSoft }}
    >
      {t('commoncomponents.scenariomanager.table.scenarioTooltip.noDescription', 'Empty')}
    </Typography>
  );

  const tags = scenario?.tags ?? [];
  const tagElements =
    tags.length > 0 ? (
      <Grid container spacing={1.5}>
        {tags.map((tag, index) => (
          <Chip key={index} label={tag} data-cy={`scenario-info-tag-${index}`} color="primary" />
        ))}
      </Grid>
    ) : (
      <Typography
        data-cy="scenario-info-no-tags-placeholder"
        variant="body2"
        sx={{ color: (theme) => theme.palette.appbar.contrastTextSoft }}
      >
        {t('commoncomponents.scenariomanager.table.scenarioTooltip.noTags', 'None')}
      </Typography>
    );

  return (
    <div>
      <Box
        data-cy={`scenario-info-${scenario?.id}`}
        ref={anchorElement}
        onMouseEnter={openPopover}
        onMouseLeave={closePopover}
        aria-owns={open ? 'scenario-info-popover' : undefined}
        aria-haspopup="true"
        sx={{ mx: 1 }}
      >
        <InfoOutlinedIcon color="action" fontSize="small" sx={{ display: 'inherit' }} />
      </Box>
      <Popover
        id="scenario-info-popover"
        data-cy="scenario-info-popover"
        disableAutoFocus
        disableEnforceFocus
        open={isPopoverOpened}
        anchorEl={anchorElement.current}
        sx={{ pointerEvents: 'none' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClose={closePopover}
        marginThreshold={0}
        slotProps={{
          paper: {
            sx: { px: 2, pt: 1.5, pb: 1, minWidth: '200px', pointerEvents: 'auto' },
            onMouseEnter: openPopover,
            onMouseLeave: closePopover,
          },
        }}
      >
        <Stack spacing={1}>
          <Stack>
            <Typography variant="h6">
              {t('commoncomponents.dialog.create.scenario.input.description', 'Description')}
            </Typography>
            {description}
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h6">{t('commoncomponents.dialog.create.scenario.input.tags', 'Tags')}</Typography>
            {tagElements}
          </Stack>
        </Stack>
      </Popover>
    </div>
  );
};

ScenarioInfoTooltip.propTypes = {
  scenario: PropTypes.object,
};

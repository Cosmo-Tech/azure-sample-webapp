// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { exists } from 'i18next';
import { TranslationUtils } from '../../../../../../utils';
import { KPI } from './components';

const useStyles = makeStyles((theme) => ({
  categoryType: { opacity: '70%' },
}));

const CategoryAccordion = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { id, category, queriesResults } = props;

  const [expanded, setExpanded] = useState(false);
  const toggleAccordion = (event, isExpanded) => setExpanded(isExpanded);

  const accordionSummary = useMemo(() => {
    const categorySummary = (
      <Grid container spacing={1}>
        <Grid item>
          <Typography variant="body1">
            {t(TranslationUtils.getDatasetCategoryNameTranslationKey(category.id), category.id ?? 'category')}
          </Typography>
        </Grid>
        {category.type && (
          <>
            <Grid item>
              <Typography variant="body1" className={classes.categoryType}>
                {'|'}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" className={classes.categoryType}>
                {t(
                  `commoncomponents.datasetmanager.overview.categoryTypes.${category.type.toLowerCase()}`,
                  category.type
                )}
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    );

    let categoryMainKpis = null;
    if (!expanded && category.kpis) {
      categoryMainKpis = category.kpis
        .filter((kpi) => kpi.id != null)
        .slice(0, 2)
        .map((kpi, index) => {
          const kpiWithResult = {
            ...kpi,
            ...queriesResults.categoriesKpis.find((kpiResult) => kpiResult.id === kpi.id),
          };
          return (
            <Grid item key={`kpi${index}`}>
              <KPI
                labelProps={{ sx: { opacity: '70%' } }}
                valueProps={{ sx: { opacity: '70%' } }}
                kpi={kpiWithResult}
                categoryId={category.id}
              />
            </Grid>
          );
        });

      if (categoryMainKpis.length === 2)
        categoryMainKpis.splice(
          1,
          0,
          <Grid item key="kpi-separator">
            <Typography sx={{ opacity: '70%' }}>|</Typography>
          </Grid>
        );
    }

    return (
      <Grid
        id={id}
        container
        spacing={1}
        sx={{
          flexFlow: 'row wrap',
          justifyContent: 'space-between',
        }}
      >
        <Grid item lg={4} sx={{ overflow: 'hidden' }}>
          {categorySummary}
        </Grid>
        <Grid item lg={8}>
          <Grid container spacing={1}>
            {categoryMainKpis}
          </Grid>
        </Grid>
      </Grid>
    );
  }, [t, id, category, classes, expanded, queriesResults.categoriesKpis]);

  const accordionDetails = useMemo(() => {
    const hasDescription = exists(TranslationUtils.getDatasetCategoryDescriptionTranslationKey(category.id));
    const descriptionString = t(TranslationUtils.getDatasetCategoryDescriptionTranslationKey(category.id));
    const description = hasDescription && <Typography sx={{ whiteSpace: 'pre-line' }}>{descriptionString}</Typography>;

    let categoryKpis = null;
    if (category.kpis && category.kpis.length > 0)
      categoryKpis = category.kpis.map((kpi, index) => {
        const kpiWithResult = {
          ...kpi,
          ...queriesResults.categoriesKpis.find((kpiResult) => kpiResult.id === kpi.id),
        };
        return (
          <KPI
            key={`kpi-${index}`}
            valueProps={{ sx: { opacity: '70%' } }}
            kpi={kpiWithResult}
            categoryId={category.id}
          />
        );
      });

    const attributes = category.attributes && (
      <Grid
        container
        spacing={1}
        sx={{
          flexFlow: 'row nowrap',
          alignItems: 'center',
        }}
      >
        <Grid item>
          <Typography>{t('commoncomponents.datasetmanager.overview.attributesLabel', 'Attributes:')}</Typography>
        </Grid>
        <Grid item>
          <Typography sx={{ opacity: '70%' }}>{category.attributes.join(', ')}</Typography>
        </Grid>
      </Grid>
    );

    return (
      <Grid
        container
        spacing={2}
        sx={{
          flexFlow: 'column nowrap',
        }}
      >
        {description && <Grid item>{description}</Grid>}
        {categoryKpis && <Grid item>{categoryKpis}</Grid>}
        {attributes && <Grid item>{attributes}</Grid>}
      </Grid>
    );
  }, [t, category, queriesResults.categoriesKpis]);

  return (
    <Accordion expanded={expanded} onChange={toggleAccordion}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>{accordionSummary}</AccordionSummary>
      <AccordionDetails>{accordionDetails}</AccordionDetails>
    </Accordion>
  );
};

CategoryAccordion.propTypes = {
  id: PropTypes.string,
  category: PropTypes.object,
  queriesResults: PropTypes.object,
};

CategoryAccordion.defaultProps = {
  id: 'category',
  category: {},
  queriesResults: [],
};

export default CategoryAccordion;

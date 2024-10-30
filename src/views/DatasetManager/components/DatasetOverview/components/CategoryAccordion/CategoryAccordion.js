// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Grid2 as Grid, Typography } from '@mui/material';
import { exists } from 'i18next';
import { TranslationUtils } from '../../../../../../utils';
import { KPI, CategoryDetailsDialog } from './components';

const CategoryAccordion = (props) => {
  const { t } = useTranslation();
  const { id, category, queriesResults } = props;

  const [expanded, setExpanded] = useState(false);
  const toggleAccordion = (event, isExpanded) => setExpanded(isExpanded);

  const accordionSummary = useMemo(() => {
    const categorySummary = (
      <Grid container spacing={1} data-cy={`category-accordion-summary-${category.id}`}>
        <Grid>
          <Typography data-cy="category-name" variant="body1">
            {t(TranslationUtils.getDatasetCategoryNameTranslationKey(category.id), category.id ?? 'category')}
          </Typography>
        </Grid>
        {category.type && (
          <Grid container>
            <Grid>
              <Typography variant="body1" sx={{ opacity: '70%' }}>
                {'|'}
              </Typography>
            </Grid>
            <Grid>
              <Typography data-cy="category-type" variant="body1" sx={{ opacity: '70%' }}>
                {t(
                  `commoncomponents.datasetmanager.overview.categoryTypes.${category.type.toLowerCase()}`,
                  category.type
                )}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    );

    let categoryMainKpis = null;
    if (!expanded && category?.kpis) {
      categoryMainKpis = (category?.kpis ?? [])
        .filter((kpi) => kpi.id != null)
        .slice(0, 2)
        .map((kpi, index) => {
          const kpiWithResult = {
            ...kpi,
            ...queriesResults.categoriesKpis.find((kpiResult) => kpiResult.id === kpi.id),
          };
          return (
            <Grid key={`kpi${index}`}>
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
          <Grid key="kpi-separator">
            <Typography sx={{ opacity: '70%' }}>|</Typography>
          </Grid>
        );
    }

    return (
      <Grid id={id} container spacing={1} size="grow" sx={{ flexFlow: 'row wrap', justifyContent: 'space-between' }}>
        <Grid container size={{ lg: 4 }}>
          {categorySummary}
        </Grid>
        <Grid container spacing={1} size={{ lg: 8 }}>
          {categoryMainKpis}
        </Grid>
      </Grid>
    );
  }, [t, id, category, expanded, queriesResults.categoriesKpis]);

  const accordionDetails = useMemo(() => {
    const hasDescription = exists(TranslationUtils.getDatasetCategoryDescriptionTranslationKey(category.id));
    const descriptionString = t(TranslationUtils.getDatasetCategoryDescriptionTranslationKey(category.id));
    const description = hasDescription && (
      <Typography data-cy={'category-description'} sx={{ whiteSpace: 'pre-line' }}>
        {descriptionString}
      </Typography>
    );

    const kpisWithResult = (category?.kpis ?? []).map((kpi) => ({
      ...kpi,
      ...queriesResults.categoriesKpis.find((kpiResult) => kpiResult.id === kpi.id),
    }));

    let categoryKpis = null;
    if (category.kpis && category.kpis.length > 0)
      categoryKpis = category.kpis.map((kpi, index) => {
        return (
          <KPI
            key={`kpi-${index}`}
            valueProps={{ sx: { opacity: '70%' } }}
            kpi={kpisWithResult.find((kpiResult) => kpiResult.id === kpi.id)}
            categoryId={category.id}
          />
        );
      });

    const attributes = category.attributes && (
      <Grid container spacing={1} sx={{ flexFlow: 'row nowrap', alignItems: 'center' }}>
        <Grid>
          <Typography>{t('commoncomponents.datasetmanager.overview.attributesLabel', 'Attributes:')}</Typography>
        </Grid>
        <Grid>
          <Typography data-cy="category-attributes" sx={{ opacity: '70%' }}>
            {category.attributes?.join(', ')}
          </Typography>
        </Grid>
      </Grid>
    );

    return (
      <Grid
        data-cy={`category-accordion-details-${category.id}`}
        container
        spacing={2}
        sx={{ flexFlow: 'column nowrap' }}
      >
        {description && <Grid>{description}</Grid>}
        {categoryKpis && <Grid>{categoryKpis}</Grid>}
        {attributes && <Grid>{attributes}</Grid>}
        <Grid container direction="row" sx={{ justifyContent: 'flex-end' }}>
          <CategoryDetailsDialog category={category} kpis={kpisWithResult} />
        </Grid>
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

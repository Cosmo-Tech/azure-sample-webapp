// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import { Grid, TextField, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import MetadataLabel from '../MetadataLabel';

const useStyles = makeStyles((theme) => ({
  editIcon: {
    width: '16px',
    height: '16px',
  },
}));

const DescriptionEditor = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { onChange, readOnly, value } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [descriptionText, setDescriptionText] = useState(value);

  useEffect(() => {
    if (value !== descriptionText) setDescriptionText(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const startEdition = useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsEditing(true);
    setIsHovered(false);
  }, []);

  const stopEdition = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      setIsEditing(false);

      if (onChange && event.target.value !== value) onChange(event.target.value);
    },
    [onChange, value]
  );

  const editIcon = useMemo(() => {
    if (readOnly || isEditing || !isHovered) return null;
    return <EditIcon data-cy="edit-description" className={classes.editIcon} onClick={startEdition}></EditIcon>;
  }, [readOnly, isEditing, isHovered, classes.editIcon, startEdition]);

  const description = useMemo(() => {
    if (readOnly || !isEditing)
      return (
        <Typography sx={{ pl: 1 }} onClick={startEdition}>
          {value}
        </Typography>
      );

    return (
      <TextField
        data-cy="description-textfield"
        variant="outlined"
        fullWidth={true}
        multiline
        value={descriptionText ?? ''}
        onChange={(event) => setDescriptionText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            stopEdition(event);
            setDescriptionText(value);
          } else if (event.ctrlKey && event.key === 'Enter') {
            stopEdition(event);
          }
        }}
        onBlur={stopEdition}
        placeholder={t(
          'commoncomponents.datasetmanager.metadata.descriptionPlaceholder',
          'Enter the dataset description'
        )}
        inputRef={(input) => input && input.focus()}
        inputProps={{ id: 'description-input' }}
        sx={{ pl: 1 }}
      />
    );
  }, [isEditing, readOnly, descriptionText, value, startEdition, stopEdition, t]);

  return (
    <>
      <Grid
        item
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-cy="dataset-metadata-description"
      >
        <Grid container sx={{ flexFlow: 'row nowrap', alignItems: 'center' }}>
          <MetadataLabel
            label={t('commoncomponents.datasetmanager.metadata.description', 'Description')}
          ></MetadataLabel>
          {editIcon}
        </Grid>
        {description}
      </Grid>
    </>
  );
};

DescriptionEditor.propTypes = {
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  value: PropTypes.string,
};

DescriptionEditor.defaultProps = {
  readOnly: false,
  value: '',
};

export default DescriptionEditor;

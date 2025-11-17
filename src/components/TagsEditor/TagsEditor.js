// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { TagsEditor as BaseTagsEditor } from '@cosmotech/ui';

const deduplicateTags = (tags) => Array.from(new Set(tags ?? []));

export const TagsEditor = ({ values = [], onChange, ...otherProps }) => {
  const safeValues = useMemo(() => deduplicateTags(values), [values]);

  const handleChange = useCallback(
    (newTags = []) => {
      if (typeof onChange === 'function') {
        onChange(deduplicateTags(newTags));
      }
    },
    [onChange]
  );

  return <BaseTagsEditor {...otherProps} values={safeValues} onChange={handleChange} />;
};

TagsEditor.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

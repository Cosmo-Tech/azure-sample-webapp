// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import './AgGrid.css';
import parse from 'html-react-parser';

const CSS_TOOLTIP_CLASS = 'ag-grid-row-tooltip';

const AgGridRowTooltip = React.forwardRef((props, ref) => {
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState(props.api.getDisplayedRowAtIndex(props.rowIndex).data);

  useImperativeHandle(ref, () => {
    return {
      getReactContainerClasses () {
        return [CSS_TOOLTIP_CLASS];
      }
    };
  });

  const constructTooltip = (data) => {
    let tooltip = `<div className="${CSS_TOOLTIP_CLASS}">`;
    for (const key in data) {
      tooltip = tooltip.concat(`
      <p>
        <span>${key} : ${data[key]}</span>
      </p>`);
    }
    tooltip = tooltip.concat('</div>');
    return parse(tooltip);
  };

  return (<>{constructTooltip(data)} </>);
});

AgGridRowTooltip.displayName = 'AgGridRowTooltip';

AgGridRowTooltip.propTypes = {
  rowIndex: PropTypes.number.isRequired,
  api: PropTypes.object.isRequired,
  color: PropTypes.string
};

export default AgGridRowTooltip;

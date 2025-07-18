// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { embedDashboard } from '@superset-ui/embedded-sdk';

export const SupersetEmbeddedReport = ({ id }) => {
  const elementId = id ?? 'superset-embedded-report'; // TODO: useMemo

  // useEffect(() => {
  //   const container = document.getElementById(elementId);
  //   embedDashboard({
  //     id: "K7yz1EQ106p", // given by the Superset embedding UI
  //     supersetDomain: "https://superset-kubernetes.cosmotech.com",
  //     mountPoint: container,
  //     fetchGuestToken: () => "test",
  //     dashboardUiConfig: { // dashboard UI config: hideTitle, hideTab, hideChartControls, filters.visible, filters.expanded (optional), urlParams (optional)
  //         hideTitle: true,
  //         filters: {
  //             expanded: true,
  //         },
  //         urlParams: {
  //             foo: 'value1',
  //             bar: 'value2',
  //             // ...
  //         }
  //     },
  //     // iframeSandboxExtras: ['allow-top-navigation', 'allow-popups-to-escape-sandbox'],
  //     // referrerPolicy: "same-origin"
  //   });
  //
  //   if (container && container.children[0]) {
  //     container.children[0].style.width = "100%";
  //     container.children[0].style.height = "100%";
  //   }
  // }, []);
  // return <div style={{width: '100%', height: '500px'}} id={elementId}></div>;

  // URL example: https://superset.example.com/superset/explore/p/K7yz1EQ106p/?standalone=1&height=400

  return (
    <div>
      <iframe
        width="100%"
        height="500px"
        seamless
        frameBorder="0"
        scrolling="no"
        src="https://superset-kubernetes.cosmotech.com/superset/dashboard/p/Vmv5p78Y3Xj/?standalone=3&height=400"
      ></iframe>
    </div>
  );
};

SupersetEmbeddedReport.propTypes = {
  id: PropTypes.string,
};

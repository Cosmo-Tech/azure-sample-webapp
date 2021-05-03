// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  dispatchGetAllInitialData,
  dispatchSetApplicationStatus
} from '../../state/dispatchers/app/ApplicationDispatcher';
import { connect } from 'react-redux';
import Loading from './Loading';

const mapDispatchToProps = {
  getAllInitialDataAction: dispatchGetAllInitialData,
  setApplicationStatusAction: dispatchSetApplicationStatus
};

const mapStateToProps = (state) => ({
  scenarioList: state.scenario.list,
  scenarioTree: state.scenario.tree,
  datasetList: state.dataset.list,
  application: state.application
});

export default connect(mapStateToProps, mapDispatchToProps)(Loading);

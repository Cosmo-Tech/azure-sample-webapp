// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
// Current Solution
import { createSlice } from '@reduxjs/toolkit';
import { STATUSES } from '../../services/config/StatusConstants';

export const currentSolutionInitialState = {
  current: {
    data: null,
    status: STATUSES.IDLE,
  },
};

const currentSolutionSlice = createSlice({
  name: 'solution',
  initialState: currentSolutionInitialState,
  reducers: {
    setCurrentSolution: (state, action) => {
      const { solution, status } = action.payload;
      state.current.data = solution;
      state.current.status = status;
    },
    resetCurrentSolution: (state) => {
      state.current.data = null;
      state.current.status = STATUSES.IDLE;
    },
  },
});
export const { setCurrentSolution, resetCurrentSolution } = currentSolutionSlice.actions;
export default currentSolutionSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeSection: 'datasets',
  isCollapsed: false,
  sections: [
    { id: 'datasets', path: '/datasets', label: 'Datasets' },
    { id: 'scenarios', path: '/scenarios', label: 'Scenarios' },
    { id: 'scorecard', path: '/scorecard', label: 'Scorecard' },
  ],
};

const mainNavigationSlice = createSlice({
  name: 'mainNavigation',
  initialState,
  reducers: {
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    setCollapsed: (state, action) => {
      state.isCollapsed = action.payload;
    },
    useSections: (state, action) => {
      state.sections = action.payload;
    },
    useActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
  },
});

export const { setActiveSection, setCollapsed } = mainNavigationSlice.actions;
export default mainNavigationSlice.reducer;

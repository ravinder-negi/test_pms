import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../globalAction';

const initialState = {
  filterData: null,
  activeTabPro: 'General Info',
  docActiveTabPro: 1
};
const ProjectSlice = createSlice({
  name: 'ProjectSlice',
  initialState,

  reducers: {
    updateFilters: (state, actions) => {
      if (actions) {
        state.filterData = actions?.payload;
      }
    },
    updateActiveTabPro: (state, actions) => {
      state.activeTabPro = actions?.payload;
    },
    updateDocActiveTabPro: (state, actions) => {
      state.docActiveTabPro = actions?.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => ({ ...initialState }));
  }
});
export const { updateFilters, updateActiveTabPro, updateDocActiveTabPro } = ProjectSlice.actions;
export default ProjectSlice.reducer;

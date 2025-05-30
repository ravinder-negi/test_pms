import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../globalAction';

const initialState = {
  activeTab: 'General Info',
  filterData: null,
  docActiveTab: 1
};

const EmployeeSlice = createSlice({
  name: 'EmployeeSlice',
  initialState,

  reducers: {
    updateActiveTab: (state, actions) => {
      state.activeTab = actions?.payload;
    },
    updateDocActiveTab: (state, actions) => {
      state.docActiveTab = actions?.payload;
    },
    updateFilters: (state, actions) => {
      if (actions) {
        state.filterData = actions?.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => ({ ...initialState }));
  }
});
export const { updateActiveTab, updateFilters, updateDocActiveTab } = EmployeeSlice.actions;
export default EmployeeSlice.reducer;

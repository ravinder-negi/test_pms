import { createSlice } from '@reduxjs/toolkit';

const subAdminSlice = createSlice({
  name: 'EmployeeSlice',
  initialState: {
    filterData: null
  },

  reducers: {
    updateFilters: (state, actions) => {
      if (actions) {
        state.filterData = actions?.payload;
      }
    }
  }
});
export const { updateFilters } = subAdminSlice.actions;
export default subAdminSlice.reducer;

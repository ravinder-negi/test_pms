import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../globalAction';

const initialState = {
  filterData: null
};
const ReportingSlice = createSlice({
  name: 'ReportingSlice',
  initialState,

  reducers: {
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
export const { updateFilters } = ReportingSlice.actions;
export default ReportingSlice.reducer;

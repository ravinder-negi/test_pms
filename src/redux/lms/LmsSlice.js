// LmsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../globalAction';

const initialState = {
  LmsTab: 'upcoming'
};

const LmsSlice = createSlice({
  name: 'LmsSlice',
  initialState,
  reducers: {
    updateLmsTab: (state, actions) => {
      if (actions) {
        state.LmsTab = actions.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => ({ ...initialState }));
  }
});

export const { updateLmsTab } = LmsSlice.actions;
export default LmsSlice.reducer;

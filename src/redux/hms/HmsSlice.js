import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../globalAction';

const initialState = {
  HmsTab: 'Inventory',
  InternalHmsTab: 'Hardware Info'
};

const HmsSlice = createSlice({
  name: 'HmsSlice',
  initialState,
  reducers: {
    updateHmsTab: (state, actions) => {
      if (actions) {
        state.HmsTab = actions.payload;
      }
    },
    updateInternalHmsTab: (state, actions) => {
      if (actions) {
        state.InternalHmsTab = actions.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => ({ ...initialState }));
  }
});

export const { updateHmsTab, updateInternalHmsTab } = HmsSlice.actions;
export default HmsSlice.reducer;

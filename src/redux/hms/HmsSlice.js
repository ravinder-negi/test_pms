import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../globalAction';

const initialState = {
  HmsTab: 'Inventory'
};

const HmsSlice = createSlice({
  name: 'HmsSlice',
  initialState,
  reducers: {
    updateHmsTab: (state, actions) => {
      if (actions) {
        state.HmsTab = actions.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => ({ ...initialState }));
  }
});

export const { updateHmsTab } = HmsSlice.actions;
export default HmsSlice.reducer;

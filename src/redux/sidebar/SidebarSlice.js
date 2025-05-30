import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../globalAction';

const initialState = {
  isSidebarOpen: true,
  isActivityDrawer: false
};
export const SidebarSlice = createSlice({
  name: 'SignInSlice',
  initialState,
  reducers: {
    updateSidebar: (state, actions) => {
      if (actions) {
        state.isSidebarOpen = actions.payload;
      }
    },
    updateActivityDrawer: (state, actions) => {
      if (actions) {
        state.isActivityDrawer = actions.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => ({ ...initialState }));
  }
});

export const { updateSidebar, updateActivityDrawer } = SidebarSlice.actions;
export default SidebarSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../globalAction';

const initialState = {
  NotificationTab: 'Sent'
};

const NotificationSlice = createSlice({
  name: 'NotificationSlice',
  initialState,
  reducers: {
    updateNotificationTab: (state, actions) => {
      if (actions) {
        state.NotificationTab = actions.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => ({ ...initialState }));
  }
});

export const { updateNotificationTab } = NotificationSlice.actions;
export default NotificationSlice.reducer;

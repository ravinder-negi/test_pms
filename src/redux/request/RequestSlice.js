import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../globalAction';

const initialState = {
  RequestTab: 'upcoming'
};

const RequestSlice = createSlice({
  name: 'RequestSlice',
  initialState,
  reducers: {
    updateRequestTab: (state, actions) => {
      if (actions) {
        state.RequestTab = actions.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => ({ ...initialState }));
  }
});

export const { updateRequestTab } = RequestSlice.actions;
export default RequestSlice.reducer;

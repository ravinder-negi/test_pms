import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../globalAction';

const initialState = {
  data: null,
  isEmployee: null,
  accessList: {},
  sectionAccessList: {},
  loggedUserType: null,
  role: {},
  anyScreenAccess: null,
  slectedResponseMenu: 1,
  loading: false,
  updateLoading: false,
  token: null
};

const UserInfoSlice = createSlice({
  name: 'SignInSlice',
  initialState,
  reducers: {
    setLoginInRole: (state, actions) => {
      if (actions) {
        state.isEmployee = actions.payload?.isEmployee;
        state.loggedUserType = actions.payload?.loggedUserType;
        state.role = actions.payload?.role;
      }
    },
    addAccessList: (state, actions) => {
      if (actions) {
        state.accessList = actions.payload;
      }
    },
    addSectionAccess: (state, actions) => {
      if (actions) {
        state.sectionAccessList = actions.payload;
      }
    },
    setAnyScreenAccess: (state, actions) => {
      if (actions) {
        state.anyScreenAccess = actions.payload;
      }
    },
    setSelectResponseMenu: (state, actions) => {
      if (actions) {
        state.slectedResponseMenu = actions.payload;
      }
    },
    setUserInfo: (state, actions) => {
      if (actions) {
        state.data = actions.payload;
      }
      state.updateLoading = false;
    },
    setLoading: (state, actions) => {
      if (actions) {
        state.loading = actions.payload;
      }
    },
    setUpdateLoading: (state, actions) => {
      if (actions) {
        state.updateLoading = actions.payload;
      }
    },
    setToken: (state, actions) => {
      if (actions) {
        state.token = actions.payload;
      }
    },
    resetUserInfoSlice: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => ({ ...initialState }));
  }
});

export const {
  setLoginInRole,
  setSelectResponseMenu,
  setUserInfo,
  setLoading,
  setUpdateLoading,
  setToken,
  resetUserInfoSlice
} = UserInfoSlice.actions;
export default UserInfoSlice.reducer;

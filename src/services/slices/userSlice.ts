import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';

export type TUser = {
  email: string;
  name: string;
};

export interface IUserSlice {
  userData: TUser | null;
  isUserAuth: boolean;
  isUserLoading: boolean;
  error: string | null;
}

const initialState: IUserSlice = {
  userData: null,
  isUserAuth: false,
  isUserLoading: false,
  error: null
};

export const fetchUser = createAsyncThunk('user:fetch', getUserApi);

export const regUser = createAsyncThunk(
  'user:registration',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res;
  }
);

export const loginUser = createAsyncThunk(
  'user:login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res;
  }
);

export const logoutUser = createAsyncThunk('user:logout', async () => {
  const res = await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
  return res;
});

export const updateUser = createAsyncThunk(
  'user:update',
  async (data: Partial<TRegisterData>) => await updateUserApi(data)
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isUserLoading = false;
        state.isUserAuth = false;
        state.userData = null;
        state.error = 'Не удалось получить данные пользователя';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.isUserAuth = true;
        state.userData = action.payload.user;
      })
      // register
      .addCase(regUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(regUser.rejected, (state) => {
        state.isUserLoading = false;
        state.error = 'Не удалось зарегистрироваться';
      })
      .addCase(regUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.isUserAuth = true;
        state.userData = action.payload.user;
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isUserLoading = false;
        state.error = 'Не удалось войти';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.isUserAuth = true;
        state.userData = action.payload.user;
      })
      // logout
      .addCase(logoutUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isUserLoading = false;
        state.error = 'Не удалось выйти из аккаунта';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isUserLoading = false;
        state.isUserAuth = false;
        state.userData = null;
      })
      // update
      .addCase(updateUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isUserLoading = false;
        state.error = 'Не удалось обновить данные пользователя';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.userData = action.payload.user;
      });
  }
});

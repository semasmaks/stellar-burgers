import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { TOrder, TUser } from '@utils-types';

export interface IUserState {
  userData: TUser | null;
  isUserAuth: boolean;
  isUserLoading: boolean;
  isAuthChecked: boolean;
  userError: string | null;
  ordersHistory: TOrder[];
  isOrdersLoading: boolean;
  orderRequest: boolean;
}

const initialState: IUserState = {
  userData: null,
  isUserAuth: false,
  isUserLoading: false,
  isAuthChecked: false,
  userError: null,
  ordersHistory: [],
  orderRequest: false,
  isOrdersLoading: false
};

export const fetchUser = createAsyncThunk('user:fetch', getUserApi);

export const registerUser = createAsyncThunk(
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

export const postOrder = createAsyncThunk(
  'order:post',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response.order;
  }
);

export const fetchUserOrders = createAsyncThunk(
  'userOrders:fetch',
  getOrdersApi
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchUser.pending, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isUserLoading = false;
        state.isUserAuth = false;
        state.userData = null;
        state.isAuthChecked = true;
        state.userError = 'Не удалось получить данные пользователя';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.isUserAuth = true;
        state.userData = action.payload.user;
        state.isAuthChecked = true;
      })
      // register
      .addCase(registerUser.pending, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isUserLoading = false;
        state.userError = 'Не удалось зарегистрироваться';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.isUserAuth = true;
        state.userData = action.payload.user;
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.userError = 'Не верно введены почта или пароль';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.isUserAuth = true;
        state.userData = action.payload.user;
      })
      // logout
      .addCase(logoutUser.pending, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isUserLoading = false;
        state.userError = 'Не удалось выйти из аккаунта';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isUserLoading = false;
        state.isUserAuth = false;
        state.userData = null;
      })
      // update
      .addCase(updateUser.pending, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isUserLoading = false;
        state.userError = 'Не удалось обновить данные пользователя';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.userData = action.payload.user;
      })
      // order:post
      .addCase(postOrder.pending, (state) => {
        state.orderRequest = true;
        state.userError = null;
      })
      .addCase(postOrder.rejected, (state) => {
        state.orderRequest = false;
        state.userError = 'Не удалось обработать заказ';
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
      })
      // userOrders:fetch
      .addCase(fetchUserOrders.pending, (state) => {
        state.isOrdersLoading = true;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.isOrdersLoading = false;
        state.userError = 'Не удалось загрузить историю заказов';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.ordersHistory = action.payload;
      });
  }
});

export const { setAuthChecked } = userSlice.actions;

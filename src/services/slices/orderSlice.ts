import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi, orderBurgerApi, TNewOrder } from '@api';
import { TOrder } from '@utils-types';

export interface IOrderState {
  orderModalData: TNewOrder | null;
  orderRequest: boolean;
  error: string | null;
  ordersIsLoading: boolean;
  ordersHistoryIsInited: boolean;
  ordersHistory: TOrder[];
}

const initialState: IOrderState = {
  orderModalData: null,
  orderRequest: false,
  error: null,
  ordersIsLoading: false,
  ordersHistoryIsInited: false,
  ordersHistory: []
};

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

export const orderSlice = createSlice({
  name: 'orderSlice',
  initialState,
  reducers: {
    setOrderModalData: (state, action: PayloadAction<TNewOrder | null>) => {
      state.orderModalData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // order:post
      .addCase(postOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(postOrder.rejected, (state) => {
        state.orderRequest = false;
        state.error = 'Не удалось обработать заказ';
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      // userOrders:fetch
      .addCase(fetchUserOrders.pending, (state) => {
        state.ordersIsLoading = true;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.ordersIsLoading = false;
        state.error = 'Не удалось загрузить историю заказов';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.ordersIsLoading = false;
        state.ordersHistory = action.payload;
        state.ordersHistoryIsInited = true;
      });
  }
});

export const { setOrderModalData } = orderSlice.actions;

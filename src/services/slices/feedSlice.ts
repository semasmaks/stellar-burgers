import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi } from '@api';

interface IFeedState {
  orders: TOrder[];
  selectedOrder: TOrder | null;
  isFeedLoading: boolean;
  isInit: boolean;
  error: string | null;
  feed: {
    total: number;
    totalToday: number;
  };
}

const initialState: IFeedState = {
  orders: [],
  selectedOrder: null,
  isFeedLoading: false,
  isInit: false,
  error: null,
  feed: {
    total: 0,
    totalToday: 0
  }
};

export const fetchOrders = createAsyncThunk('feedOrders:fetch', getFeedsApi);
export const getOrderByNumber = createAsyncThunk(
  'feedOrders:getOrder',
  async (orderNumber: number) => {
    const res = await getOrderByNumberApi(orderNumber);
    return res.orders[0];
  }
);

export const feedSlice = createSlice({
  name: 'feedSlice',
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      if (action.payload === null) {
        state.selectedOrder = null;
        return;
      }
      const order = state.orders.find((order) => order._id === action.payload);
      if (order) state.selectedOrder = order;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isFeedLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.isFeedLoading = false;
        state.error = 'Не удалось загрузить ленту заказов';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isFeedLoading = false;
        state.error = null;
        state.orders = action.payload.orders;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
        state.isInit = true;
        // TODO: удалить лог
        // console.log('state', state.orders);
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      });
  }
});

export const { setSelectedOrder } = feedSlice.actions;

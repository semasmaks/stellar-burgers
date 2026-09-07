import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userSlice } from './slices/userSlice';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { orderSlice } from './slices/orderSlice';
import { constructorSlice } from './slices/constructorSlice';
import { feedSlice } from './slices/feedSlice';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  ingredients: ingredientsSlice.reducer,
  order: orderSlice.reducer,
  constructorSlice: constructorSlice.reducer,
  feed: feedSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

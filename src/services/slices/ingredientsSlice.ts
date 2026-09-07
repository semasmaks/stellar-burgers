import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

interface IFeedSlice {
  ingredients: TIngredient[];
  selectedIngredient: TIngredient | null;
  isIngredientsLoading: boolean;
  error: string | null;
}

const initialState: IFeedSlice = {
  ingredients: [],
  selectedIngredient: null,
  isIngredientsLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients:fetch',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredientsSlice',
  initialState,
  reducers: {
    setSelectedIngredient: (state, action: PayloadAction<string | null>) => {
      if (action.payload === null) {
        state.selectedIngredient = null;
        return;
      }
      const ingredient = state.ingredients.find(
        (item) => item._id === action.payload
      );
      if (ingredient) state.selectedIngredient = ingredient;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.isIngredientsLoading = false;
        state.error = 'Не удалось загрузить список ингредиентов';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const { setSelectedIngredient } = ingredientsSlice.actions;

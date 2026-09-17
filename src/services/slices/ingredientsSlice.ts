import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

interface IIngredientState {
  ingredients: TIngredient[];
  selectedIngredient: TIngredient | null;
  isIngredientsInited: boolean;
  isIngredientsLoading: boolean;
  ingredientError: string | null;
}

const initialState: IIngredientState = {
  ingredients: [],
  selectedIngredient: null,
  isIngredientsInited: false,
  isIngredientsLoading: false,
  ingredientError: null
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
        state.ingredientError = null;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.isIngredientsLoading = false;
        state.isIngredientsInited = true;
        state.ingredientError = 'Не удалось загрузить список ингредиентов';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.isIngredientsInited = true;
        state.ingredients = action.payload;
      });
  }
});

export const { setSelectedIngredient } = ingredientsSlice.actions;

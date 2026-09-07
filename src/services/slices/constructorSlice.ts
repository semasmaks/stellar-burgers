import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface IConstructorState {
  bun: TIngredient | null;
  ingredients: TIngredient[];
}

const initialState: IConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructorSlice',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient | null>) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredients = [...state.ingredients, action.payload];
    },
    deleteIngredient: (state, action: PayloadAction<{ index: number }>) => {
      state.ingredients.splice(action.payload.index, 1);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; direction: number }>
    ) => {
      const { index, direction } = action.payload;
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= state.ingredients.length) return;
      const [removed] = state.ingredients.splice(index, 1);
      state.ingredients.splice(newIndex, 0, removed);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  setBun,
  addIngredient,
  deleteIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

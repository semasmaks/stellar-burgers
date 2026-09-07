import { createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

interface IConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: IConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructorSlice',
  initialState,
  reducers: {
    setBun: (state, action) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action) => {
      state.ingredients = [...state.ingredients, action.payload];
    },
    deleteIngredient: (state, action) => {
      state.ingredients.splice(action.payload.index, 1);
    },
    moveIngredient: (state, action) => {
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

export default constructorSlice.reducer;

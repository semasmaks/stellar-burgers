import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { TNewOrder } from '@api';

interface IConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderModalData: TNewOrder | null;
}

const initialState: IConstructorState = {
  bun: null,
  ingredients: [],
  orderModalData: null
};

export const constructorSlice = createSlice({
  name: 'constructorSlice',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient | null>) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid()
        }
      })
    },
    deleteIngredient: (state, action: PayloadAction<{ itemId: string }>) => {
      const indexOfIngredientToDelete = state.ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload.itemId
      );
      state.ingredients.splice(indexOfIngredientToDelete, 1);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ itemId: string; direction: number }>
    ) => {
      const { itemId, direction } = action.payload;
      const index = state.ingredients.findIndex(
        (ingredient) => ingredient.id === itemId
      );
      if (index === -1) return;
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= state.ingredients.length) return;
      const [removed] = state.ingredients.splice(index, 1);
      state.ingredients.splice(newIndex, 0, removed);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    setOrderModalData: (state, action: PayloadAction<TNewOrder | null>) => {
      state.orderModalData = action.payload;
    }
  }
});

export const {
  setBun,
  addIngredient,
  deleteIngredient,
  moveIngredient,
  clearConstructor,
  setOrderModalData
} = constructorSlice.actions;

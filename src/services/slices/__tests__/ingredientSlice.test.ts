import { expect } from '@jest/globals';
import {
  fetchIngredients,
  IIngredientState,
  ingredientsSlice,
  setSelectedIngredient
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

jest.mock('@api');

const reducer = ingredientsSlice.reducer;

const bunIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};
const mainIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};
const initialState: IIngredientState = ingredientsSlice.getInitialState();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('setSelectedIngredient', () => {
  const filledState: IIngredientState = {
    ...initialState,
    ingredients: [bunIngredient, mainIngredient]
  };

  it('устанавливаем выбранный ингредиент по id', () => {
    const state = reducer(
      filledState,
      setSelectedIngredient(mainIngredient._id)
    );
    expect(state.selectedIngredient).toEqual(mainIngredient);
  });

  it('сбрасываем выбранный ингредиент при null', () => {
    const stateWithSelected: IIngredientState = {
      ...filledState,
      selectedIngredient: mainIngredient
    };
    const state = reducer(stateWithSelected, setSelectedIngredient(null));
    expect(state.selectedIngredient).toBeNull();
  });
});

describe('возвращаем initialState при неизвестном экшене', () => {
  const state = reducer(undefined, { type: 'UNKNOWN' });
  expect(state).toEqual(initialState);
});

describe('fetchIngredients, extraReducers', () => {
  it('pending — включает загрузку и очищает ошибку', () => {
    const stateWithError: IIngredientState = {
      ...initialState,
      ingredientError: 'старая ошибка'
    };
    const state = reducer(stateWithError, {
      type: fetchIngredients.pending.type
    });

    expect(state.isIngredientsLoading).toBe(true);
    expect(state.ingredientError).toBeNull();
  });

  it('fulfilled — сохраняет ингредиенты, выключает загрузку', () => {
    const payload = [bunIngredient, mainIngredient];
    const state = reducer(undefined, {
      type: fetchIngredients.fulfilled.type,
      payload
    });

    expect(state.ingredients).toEqual(payload);
    expect(state.isIngredientsLoading).toBe(false);
    expect(state.isIngredientsInited).toBe(true);
    expect(state.ingredientError).toBeNull();
  });

  it('rejected — выставляет ошибку и флаг инициализации', () => {
    const state = reducer(undefined, { type: fetchIngredients.rejected.type });

    expect(state.isIngredientsLoading).toBe(false);
    expect(state.isIngredientsInited).toBe(true);
    expect(state.ingredientError).toBe(
      'Не удалось загрузить список ингредиентов'
    );
  });
});

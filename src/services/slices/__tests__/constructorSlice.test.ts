import { expect } from '@jest/globals';
import {
  addIngredient,
  clearConstructor,
  constructorSlice,
  deleteIngredient,
  moveIngredient,
  setBun,
  setOrderModalData
} from '../constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { TNewOrder } from '@api';

const reducer = constructorSlice.reducer;

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
const orderModalData: TNewOrder = {
  ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093d'],
  _id: '6aad78ce6a172d001b9954da',
  owner: {
    name: 'Максон',
    email: 'semasmaks1@gmail.com',
    createdAt: '2026-09-05T23:52:19.616Z',
    updatedAt: '2026-09-11T14:33:09.568Z'
  },
  status: 'done',
  name: 'Флюоресцентный бургер',
  createdAt: '2026-09-18T17:45:50.075Z',
  updatedAt: '2026-09-18T17:45:50.173Z',
  number: 110381,
  price: 1976
};

describe('setBun', () => {
  it('устанавливаем булку', () => {
    const state = reducer(undefined, setBun(bunIngredient));
    expect(state.bun).toEqual(bunIngredient);
  });

  it('сбрасываем булку при null', () => {
    const stateWithBun = reducer(undefined, setBun(bunIngredient));
    const state = reducer(stateWithBun, setBun(null));
    expect(state.bun).toBeNull();
  });
});

describe('addIngredient', () => {
  it('добавляем ингредиент', () => {
    const state = reducer(undefined, addIngredient(mainIngredient));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(mainIngredient);
    expect(state.ingredients[0].id).toEqual(expect.any(String));
  });

  it('проверка id для двух одинаковых ингредиентов', () => {
    const stateWithOneIngredient = reducer(
      undefined,
      addIngredient(mainIngredient)
    );
    const stateWithTwoIngredient = reducer(
      stateWithOneIngredient,
      addIngredient(mainIngredient)
    );

    expect(stateWithTwoIngredient.ingredients).toHaveLength(2);
    expect(stateWithTwoIngredient.ingredients[0].id).not.toBe(
      stateWithTwoIngredient.ingredients[1].id
    );
  });
});

describe('deleteIngredient', () => {
  it('удаляем ингредиент', () => {
    const stateWithIngredient = reducer(
      undefined,
      addIngredient(mainIngredient)
    );

    const state = reducer(
      stateWithIngredient,
      deleteIngredient({ itemId: stateWithIngredient.ingredients[0].id })
    );

    expect(state.ingredients).toHaveLength(0);
  });

  it('удаляем несуществующий ингредиент', () => {
    const stateWithIngredient = reducer(
      undefined,
      addIngredient(mainIngredient)
    );

    const state = reducer(
      stateWithIngredient,
      deleteIngredient({ itemId: 'unknown' })
    );

    expect(state.ingredients).toHaveLength(1);
  });
});

describe('moveIngredient', () => {
  const a: TConstructorIngredient = { ...mainIngredient, id: 'a' };
  const b: TConstructorIngredient = { ...mainIngredient, id: 'b' };
  const c: TConstructorIngredient = { ...mainIngredient, id: 'c' };
  const initialState = {
    bun: null,
    ingredients: [a, b, c],
    orderModalData: null
  };

  it('двигаем элемент вверх', () => {
    const state = reducer(
      initialState,
      moveIngredient({ itemId: 'b', direction: -1 })
    );
    expect(state.ingredients.map((i) => i.id)).toEqual(['b', 'a', 'c']);
  });

  it('двигаем элемент вниз', () => {
    const state = reducer(
      initialState,
      moveIngredient({ itemId: 'b', direction: 1 })
    );
    expect(state.ingredients.map((i) => i.id)).toEqual(['a', 'c', 'b']);
  });

  it('игнорирует несуществующий id', () => {
    const state = reducer(
      initialState,
      moveIngredient({ itemId: 'unknown', direction: 1 })
    );
    expect(state.ingredients.map((i) => i.id)).toEqual(['a', 'b', 'c']);
  });

  it('двигаем ингредиент за пределы', () => {
    const state = reducer(
      initialState,
      moveIngredient({ itemId: 'a', direction: 10 })
    );
    expect(state.ingredients.map((i) => i.id)).toEqual(['a', 'b', 'c']);
  });
});

describe('clearConstructor', () => {
  it('очищаем конструктор', () => {
    let initialState = reducer(undefined, setBun(bunIngredient));
    initialState = reducer(initialState, addIngredient(mainIngredient));
    initialState = reducer(initialState, addIngredient(mainIngredient));
    const state = reducer(initialState, clearConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});

describe('setOrderModalData', () => {
  it('устанавливаем данные', () => {
    const state = reducer(undefined, setOrderModalData(orderModalData));

    expect(state.orderModalData).toEqual(orderModalData);
  });

  it('удаляем данные', () => {
    const state = reducer(undefined, setOrderModalData(null));

    expect(state.orderModalData).toBeNull();
  });
});

describe('возвращаем initialState при неизвестном экшене', () => {
  const state = reducer(undefined, { type: 'UNKNOWN' });
  expect(state).toEqual(constructorSlice.getInitialState());
});

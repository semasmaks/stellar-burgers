import { FC, useEffect, useMemo, useState } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  setOrderModalData
} from '../../services/slices/constructorSlice';
import { TIngredient } from '@utils-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { postOrder } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { bun, ingredients, orderModalData } = useSelector(
    (state) => state.burgerConstructor
  );
  const constructorItems = { bun, ingredients };
  const { isUserAuth, orderRequest } = useSelector((state) => state.user);
  const [orderButtonText, setOrderButtonText] = useState('Оформить заказ');

  const onOrderClick = () => {
    if (!constructorItems.bun) setOrderButtonText('Выберите булку');
    if (!isUserAuth) navigate('/login', { state: { from: location.pathname } });
    if (!constructorItems.bun || orderRequest || !isUserAuth) return;
    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    setOrderButtonText('Обрабатываем ваш заказ');
    dispatch(postOrder(ingredientsIds))
      .unwrap()
      .then((res) => {
        dispatch(clearConstructor());
        setOrderButtonText('Оформить заказ');
        dispatch(setOrderModalData(res));
      })
      .catch((e) => console.warn(e));
  };

  useEffect(() => {
    if (constructorItems.bun) setOrderButtonText('Оформить заказ');
  }, [constructorItems.bun]);
  useEffect(
    () => () => {
      dispatch(setOrderModalData(null));
    },
    []
  );

  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TIngredient) => sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      orderButtonText={orderButtonText}
    />
  );
};

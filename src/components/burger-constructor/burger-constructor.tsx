import { FC, useEffect, useMemo, useState } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { postOrder, setOrderModalData } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { TIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const constructorItems = useSelector((state) => state.constructorSlice);
  const { orderRequest, orderModalData } = useSelector((state) => state.order);
  const isUserAuth = useSelector((state) => state.user.isUserAuth);
  const [orderButtonText, setOrderButtonText] = useState('Оформить заказ');

  const onOrderClick = () => {
    if (!constructorItems.bun) setOrderButtonText('Выберите булку');
    if (!isUserAuth) setOrderButtonText('Необходимо авторизоваться');
    if (!constructorItems.bun || orderRequest || !isUserAuth) return;
    const orderData = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    setOrderButtonText('Обрабатываем ваш заказ');
    dispatch(postOrder(orderData))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
        setOrderButtonText('Оформить заказ');
      })
      .catch((e) => console.warn(e));
  };

  useEffect(() => {
    if (constructorItems.bun) setOrderButtonText('Оформить заказ');
  }, [constructorItems.bun]);

  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
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

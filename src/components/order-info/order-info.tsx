import { FC, useEffect, useMemo } from 'react';
import { OrderInfoUI, Preloader } from '@ui';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  getOrderByNumber,
  setSelectedOrder
} from '../../services/slices/feedSlice';

export const OrderInfo: FC<{ isModal?: boolean }> = ({ isModal = false }) => {
  const dispatch = useDispatch();

  const orderData = useSelector((state) => state.feed.selectedOrder);

  const { number: orderNumber } = useParams();
  useEffect(() => {
    dispatch(getOrderByNumber(Number(orderNumber)));
    return () => {
      dispatch(setSelectedOrder(null));
    };
  }, [dispatch, orderNumber]);

  const ingredients = useSelector((state) => state.ingredients.ingredients);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} isModal={isModal} />;
};

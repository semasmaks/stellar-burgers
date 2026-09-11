import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isFeedLoading, feedError } = useSelector(
    (state) => state.feed
  );
  const { isIngredientsLoading, ingredientError } = useSelector(
    (state) => state.ingredients
  );
  const topPriorityError = feedError || ingredientError || null;
  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  const handleGetFeeds = useCallback(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isFeedLoading || isIngredientsLoading) return <Preloader />;
  if (topPriorityError) return <div>{topPriorityError}</div>;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};

import styles from './constructor-page.module.css';

import { BurgerConstructor, BurgerIngredients } from '@components';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const { ingredients, isIngredientsLoading, error } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    if (!ingredients.length) dispatch(fetchIngredients());
  }, [dispatch]);

  return isIngredientsLoading ? (
    <Preloader />
  ) : error ? (
    <div className={`${styles.error} text text_type_main-medium pt-4`}>
      {error}
    </div>
  ) : ingredients.length === 0 ? (
    <div className={`${styles.title} text text_type_main-medium pt-4`}>
      Нет ингредиентов
    </div>
  ) : (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};

import { expect, Page, test } from '@playwright/test';
import { mockUserRoute, setMockAuthTokens } from '../e2e/mocks/user.mock';

async function addIngredient(page: Page, name: string) {
  await page
    .getByRole('listitem')
    .filter({ hasText: name })
    .getByRole('button', { name: 'Добавить' })
    .click();
}

test.describe('Проверка ui страницы с конструктором', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./e2e/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
    await page.routeFromHAR('./e2e/hars/user.har', {
      url: '**/auth/user',
      update: false
    });
    await page.routeFromHAR('./e2e/hars/orderResponse.har', {
      url: '**/orders',
      update: false
    });

    await setMockAuthTokens(page); // для реальной авторизации установить в cookie/localStorage настоящие токены
    // await mockUserRoute(page) запускаем 1 раз при записи HAR, чтобы мокнуть пользователя с ненастоящими токенами
    await page.goto('/');
  });

  test('Отрисовывает ингредиенты', async ({ page }) => {
    const list = page.getByTestId('ingredients-list').first();

    await expect(list).toBeVisible();
  });

  test.describe('Проверка ui конструктора', () => {
    test('Добавляет булку в конструктор', async ({ page }) => {
      await addIngredient(page, 'Флюоресцентная булка R2-D3');

      await expect(
        page
          .locator('.constructor-element__text', {
            hasText: 'Флюоресцентная булка R2-D3'
          })
          .first()
      ).toBeVisible();
    });

    test('Добавляет ингредиенты в конструктор', async ({ page }) => {
      await addIngredient(page, 'Говяжий метеорит (отбивная)');
      await addIngredient(page, 'Мясо бессмертных моллюсков Protostomia');
      await addIngredient(page, 'Хрустящие минеральные кольца');
      await addIngredient(page, 'Плоды Фалленианского дерева');

      await expect(
        page.locator('.constructor-element__text', {
          hasText: 'Говяжий метеорит (отбивная)'
        })
      ).toBeVisible();
      await expect(
        page.locator('.constructor-element__text', {
          hasText: 'Мясо бессмертных моллюсков Protostomia'
        })
      ).toBeVisible();
      await expect(
        page.locator('.constructor-element__text', {
          hasText: 'Хрустящие минеральные кольца'
        })
      ).toBeVisible();
      await expect(
        page.locator('.constructor-element__text', {
          hasText: 'Плоды Фалленианского дерева'
        })
      ).toBeVisible();
    });
  });

  test.describe('Модальное окно', () => {
    test('Открывает модальное окно ингредиента', async ({ page }) => {
      await page.getByText('Говяжий метеорит (отбивная)').click();
      const modal = page.getByTestId('modal');

      await expect(modal).toBeVisible();
      await expect(modal).toContainText('Говяжий метеорит (отбивная)');
    });

    test('Закрывает модальное окно по клику на крестик', async ({ page }) => {
      await page.getByText('Говяжий метеорит (отбивная)').click();
      const modal = page.getByTestId('modal');

      await expect(modal).toBeVisible();
      await page.getByTestId('modal-close-btn').click();

      await expect(modal).not.toBeVisible();
    });

    test('Закрывает модальное окно по клику на оверлей', async ({ page }) => {
      await page.getByText('Говяжий метеорит (отбивная)').click();
      const modal = page.getByTestId('modal');

      await expect(modal).toBeVisible();
      await page.mouse.click(1, 1);

      await expect(modal).not.toBeVisible();
    });
  });

  test.describe('Отправка заказа', () => {
    test('Не создаёт заказ без ингредиентов', async ({ page }) => {
      await page.getByRole('button', { name: 'Оформить заказ' }).click();
      const modal = page.getByTestId('modal');

      await expect(modal).not.toBeVisible();
    });

    test('Создаёт и отправляет заказ', async ({ page }) => {
      await addIngredient(page, 'Краторная булка N-200i');
      await addIngredient(page, 'Говяжий метеорит (отбивная)');

      await page.getByRole('button', { name: 'Оформить заказ' }).click();
      const modal = page.getByTestId('modal');

      await expect(modal).toBeVisible();
      await expect(modal.getByText('5925')).toBeVisible();

      await expect(page.getByText('Выберите булки').first()).toBeVisible();
      await expect(page.getByText('Выберите начинку')).toBeVisible();

      await page.getByTestId('modal-close-btn').click();
      await expect(modal).not.toBeVisible();
    });
  });
});

import { Page } from '@playwright/test';

export const mockUser = {
  success: true,
  user: {
    email: 'test@example.com',
    name: 'Тестостероновый Тестировщик'
  }
};

export const mockAccessToken = 'mock-access-token';
export const mockRefreshToken = 'mock-refresh-token';

export const mockOrder = {
  success: true,
  name: 'Космический бургер',
  order: {
    number: 0o0001,
    _id: 'mock-order-id',
    status: 'done',
    name: 'Космический бургер',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    number_: 12345,
    ingredients: [],
    owner: {
      name: 'Тестостероновый Тестировщик',
      email: 'test@example.com',
      createdAt: '',
      updatedAt: ''
    },
    price: 1212
  }
};

export async function setMockAuthTokens(page: Page) {
  await page.addInitScript(
    ({ accessToken, refreshToken }) => {
      document.cookie = `accessToken=${accessToken}; path=/`;
      localStorage.setItem('refreshToken', refreshToken);
    },
    {
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken
    }
  );
}

export async function mockUserRoute(page: Page) {
  await page.route('**/api/auth/user', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser)
    })
  );
}

export async function mockOrderRoute(page: Page) {
  await page.route('**/api/orders', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockOrder)
    })
  );
}

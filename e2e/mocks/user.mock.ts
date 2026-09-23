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

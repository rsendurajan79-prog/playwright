import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ request }) => {
  // 1. Perform the login request
  const response = await request.post('https://api.example.com/login', {
    data: {
      username: process.env.USER_NAME,
      password: process.env.USER_PW
    }
  });

  // 2. Save the state (this captures Cookies automatically)
  await request.storageState({ path: authFile });
});
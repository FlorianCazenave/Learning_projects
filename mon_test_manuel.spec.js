import { test, expect } from '@playwright/test';

test('Mon premier test fait main sur Swag Labs', async ({ page }) => {
  // 1. Aller sur le site
  await page.goto('https://www.saucedemo.com/');

  // 2. Remplir le nom d'utilisateur (l'ID du champ est "user-name")
  // ASTUCE : On peut utiliser page.locator('#user-name')
  await page.locator('#user-name').fill('standard_user');

  // 3. Remplir le mot de passe (l'ID du champ est "password")
  await page.locator('#password').fill('secret_sauce'); // Quel mot remplace le trait ?

  // 4. Cliquer sur le bouton Login (C'est un bouton avec l'ID "login-button")
  await page.locator('#login-button').click(); // Quel mot remplace le trait ?

  // 5. Vérification : On attend que le texte "Products" soit visible
  const title = page.getByText('Products');
  await expect(title).toBeVisible(); // Quel mot pour vérifier la visibilité ?
});

test('Test erreur de connexion', async ({ page }) => {
    
    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name ').fill('standard_user');

    await page.locator('#password').fill('mauvais_mdp');

    await page.locator('#login-button').click();

    const errorMessage = page.getByText('Epic sadface: Username and password do not match any user in this service');
  await expect(errorMessage).toBeVisible();
})
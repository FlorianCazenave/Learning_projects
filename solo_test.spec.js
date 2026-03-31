import { test, expect } from '@playwright/test';

test('Ajouter au panier', async({ page, request }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('standard_user');

    await page.locator('#password').fill('secret_sauce');

    await page.locator('#login-button').click();

    const title = page.getByText('Products');
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await page.locator('[data-test="shopping-cart-link"]').click();

    await page.locator('[data-test="checkout"]').click();

    await page.locator('#first-name').fill('first name');

    await page.locator('#last-name').fill('last name');

    await page.locator('[data-test="postalCode"]').fill('00000000');

    await page.locator('[data-test="continue"]').click();

    await page.locator('[data-test="finish"]').click();

    // On vérifie que le message de succès est bien affiché
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    console.log("🛒 Achat réussi et vérifié !");

    
});
import { test, expect } from '@playwright/test';

test('Test final : Remplissage formulaire X', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('https://x.com/i/flow/signup');

  // 1. On passe les cookies
  await page.getByRole('button', { name: 'Refuse non-essential cookies' }).click({ force: true });

  // 2. On ouvre le formulaire
  await page.getByRole('button', { name: 'Create account' }).click({ force: true });

  // 3. Remplissage des infos (On utilise les labels exacts du snapshot)
  await page.getByLabel('Name').fill('Jean Dupont');
  await page.getByLabel('Phone').fill('0601020304');

  // 4. Date de naissance (Sélection dans les listes déroulantes)
  await page.getByLabel('Month').selectOption({ label: 'May' });
  await page.getByLabel('Day').selectOption({ label: '13' });
  await page.getByLabel('Year').selectOption({ label: '1990' });

  console.log("✅ Formulaire rempli avec succès !");
  
  // 5. Cliquer sur Next
  const nextButton = page.getByRole('button', { name: 'Next' });
  await expect(nextButton).toBeEnabled();
  await nextButton.click();
});
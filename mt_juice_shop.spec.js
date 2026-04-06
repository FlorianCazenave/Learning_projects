const { test } = require('@playwright/test');

test('Monkey Test - Add/Remove Elements', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');

  console.log("🐒 Le singe s'attaque aux boutons dynamiques...");

  for (let i = 0; i < 100; i++) {
    // On cherche tous les boutons sur la page
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    // On choisit un bouton au hasard (soit le "Add", soit un des "Delete")
    const randomIndex = Math.floor(Math.random() * count);
    
    try {
      await buttons.nth(randomIndex).click({ force: true, timeout: 500 });
    } catch (e) {
      // Si le bouton disparaît pile au moment du clic, on ignore
    }

    await page.waitForTimeout(20); // Vitesse maximale !
  }
  
  console.log("🏁 Test fini. Regarde si la page est devenue folle !");
});

import { test, expect } from '@playwright/test';

test('Audit de santé des liens Whoz', async ({ page, request }) => {
  await page.goto('https://www.whoz.com/en/');

  const liens = await page.locator('a').all();
  console.log(`🔍 Vérification de ${liens.length} liens en cours...`);

  for (const lien of liens) {
    const destination = await lien.getAttribute('href');
    const texte = await lien.innerText();

    // On ne teste que les liens qui commencent par "http" ou "/" (on ignore les liens vides ou javascript)
    if (destination && destination.startsWith('http')) {
      
      // LE COEUR DU TEST : On envoie une requête GET rapide à l'URL
      const reponse = await request.get(destination);

      if (reponse.ok()) {
        console.log(`✅ [${reponse.status()}] - ${texte.trim()} : Lien sain`);
      } else {
        // SI LE LIEN EST MORT (Code 404, 500, etc.)
        console.error(`❌ [${reponse.status()}] - ${texte.trim()} : LIEN CASSÉ ! -> ${destination}`);
      }
    }
  }
});
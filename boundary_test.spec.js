const { test, expect } = require('@playwright/test');

test('Universal Search Boundary Test', async ({ page }) => {
  const targetUrl = 'https://mademoisellechic.fr/'; // Change ici
  console.log(`🌐 Cible : ${targetUrl}`);
  
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // 1. GESTION DES COOKIES (Version agressive)
  const cookieTexts = ['Tout accepter', 'Tout autoriser', 'Accepter', 'Autoriser', 
    'OK', 'J\'accepte', 'Accept all', 'Allow all', 'I accept',
    'Accepter les cookies', 'Continuer sans accepter', 'Refuser', 'Refuser les cookies', 'Gérer les cookies'];
  for (const text of cookieTexts) {
    const btn = page.getByRole('button', { name: text }).first();
    if (await btn.isVisible()) {
      await btn.click();
      console.log(`✅ Cookies validés via bouton : ${text}`);
      await page.waitForTimeout(1000);
      break;
    }
  }

  // 2. DETECTION UNIVERSELLE DE LA RECHERCHE
  console.log("🔍 Tentative de détection du module de recherche...");

  // Étape A : Est-ce qu'un champ est déjà visible ?
  let searchInput = page.locator('input[type="search"], input[type="text"][name*="search" i], input[id*="search" i], input[placeholder*="recherch" i], input[placeholder*="search" i]').filter({ visible: true }).first();

  // Étape B : Si rien n'est visible, on cherche le bouton "Loupe" pour l'ouvrir
  if (await searchInput.count() === 0) {
    console.log("icon-search 🖱️ Champ caché, recherche d'un bouton d'ouverture...");
    const searchSelectors = [
      'button[aria-label*="search" i]', 
      'a[aria-label*="search" i]',
      '.search-toggle', 
      '.header-search i', 
      'svg:has-text("search")',
      '[class*="search" i] button',
      '[class*="search" i] i'
    ];

    for (const selector of searchSelectors) {
      const trigger = page.locator(selector).first();
      if (await trigger.isVisible()) {
        await trigger.click();
        console.log(`🔓 Module de recherche ouvert via : ${selector}`);
        await page.waitForTimeout(800); // Attente animation
        break;
      }
    }
    // On redéfinit le input maintenant qu'il devrait être affiché
    searchInput = page.locator('input[type="search"], input[type="text"], [role="searchbox"]').filter({ visible: true }).first();
  }

  // 3. VALIDATION ET INJECTION
  if (await searchInput.isVisible()) {
    const payload = "⚠️_TEST_".repeat(600); 
    console.log(`🚀 Injection de ${payload.length} caractères dans : ${await searchInput.getAttribute('name') || 'Champ anonyme'}`);

    await searchInput.click();
    await searchInput.fill(payload);
    
    // 4. SOUMISSION (Entrée + clic sur bouton OK si présent)
    await searchInput.press('Enter');
    console.log("⌨️ Touche Entrée pressée.");

    // Fallback : si Entrée ne marche pas, on cherche un bouton de validation à côté
    const submitBtn = page.locator('button[type="submit"], .search-submit').filter({ visible: true }).first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }

    // 5. RÉSULTATS
    try {
      const resp = await page.waitForResponse(r => r.status() > 0, { timeout: 10000 });
      console.log(`📊 Résultat : Statut ${resp.status()} en ${resp.request().timing().responseEnd / 1000}s`);
    } catch (e) {
      console.log("⚠️ Pas de réponse réseau détectée (Possible blocage local ou timeout).");
    }
  } else {
    console.error("❌ ÉCHEC : Impossible de trouver un champ de recherche sur ce site.");
  }

  await page.screenshot({ path: 'universal_test.png' });
});
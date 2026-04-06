const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default; // Assure-toi d'avoir installé @axe-core/playwright
const fs = require('fs');

test('Audit Accessibilité - Mairie de Joinville', async ({ page }) => {
  // 1. Navigation vers le site
  await page.goto('https://www.joinville-le-pont.fr/');

  // On attend que la page soit bien chargée (les menus, le bandeau, etc.)
  await page.waitForLoadState('networkidle');

  // 2. Lancement du scan Axe-Core
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']) // Normes standards internationales
    .analyze();

  // 3. Extraction des résultats pour ton Excel
  const violations = accessibilityScanResults.violations;

  if (violations.length > 0) {
    console.log(`❌ ${violations.length} types d'erreurs d'accessibilité trouvées.`);
    
    // On crée un petit résumé lisible
    const summary = violations.map(v => ({
      Impact: v.impact,
      Description: v.description,
      Aide: v.helpUrl,
      Elements_Concernes: v.nodes.length
    }));

    // On sauvegarde ça dans un fichier pour ton portfolio
    fs.writeFileSync('audit_joinville.json', JSON.stringify(summary, null, 2));
    console.log("📂 Rapport détaillé généré : audit_joinville.json");
  } else {
    console.log("✅ Félicitations ! Aucune violation détectée (très rare).");
  }
  violations[0].nodes.forEach(node => {
  console.log("Élément fautif :", node.html);
});
});

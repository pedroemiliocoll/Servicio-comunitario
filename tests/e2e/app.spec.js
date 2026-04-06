import { test, expect } from '@playwright/test';

test.describe('U.E.N. Pedro Emilio Coll - Pruebas E2E', () => {
  
  test('Carga la página de inicio correctamente', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/U.E.N. Pedro Emilio Coll/);
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=U.E.N. Pedro Emilio Coll')).toBeVisible();
  });

  test('Navegación a sección de noticias', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Noticias');
    await expect(page).toHaveURL(/.*\/noticias/);
  });

  test('Navegación a sección académica', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Académico');
    await expect(page).toHaveURL(/.*\/academico/);
  });

  test('Navegación a galería', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Galería');
    await expect(page).toHaveURL(/.*\/galeria/);
  });

  test('Navegación a contacto', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Contacto');
    await expect(page).toHaveURL(/.*\/contacto/);
  });

  test('Menú móvil se abre y cierra', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    const menuButton = page.locator('button[aria-label="Abrir menú"]');
    await expect(menuButton).toBeVisible();
    
    await menuButton.click();
    await expect(page.locator('text=Noticias')).toBeVisible();
    
    await page.click('button[aria-label="Cerrar menú"]');
  });

  test('Chatbot se abre y cierra', async ({ page }) => {
    await page.goto('/');
    
    const chatbotButton = page.locator('button[aria-label="Abrir chatbot"]');
    await expect(chatbotButton).toBeVisible();
    
    await chatbotButton.click();
    await expect(page.locator('role=dialog')).toBeVisible();
    
    await page.click('button[aria-label="Cerrar chatbot"]');
  });

  test('Portal de admin redirige correctamente', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/admin/);
  });

  test('Página 404 existe', async ({ page }) => {
    await page.goto('/ruta-inexistente-12345');
    await expect(page.locator('text=Página no encontrada')).toBeVisible();
  });

  test('API de health responde correctamente', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/health');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.version).toBeDefined();
  });

  test('API de noticias responde', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/news/public');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('Sitemap.xml existe y es válido', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/sitemap/sitemap.xml');
    expect(response.ok()).toBeTruthy();
    
    const text = await response.text();
    expect(text).toContain('<?xml');
    expect(text).toContain('<urlset');
  });

  test('robots.txt existe', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/sitemap/robots.txt');
    expect(response.ok()).toBeTruthy();
    
    const text = await response.text();
    expect(text).toContain('User-agent: *');
    expect(text).toContain('Sitemap:');
  });

  test('No hay errores críticos en consola', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('manifest.json')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});

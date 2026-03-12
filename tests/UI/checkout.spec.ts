import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Flujos de Carrito y Checkout', () => {
    let home: HomePage;
    let product: ProductPage;
    let cart: CartPage;

    test.beforeEach(async ({ page }) => {
        home = new HomePage(page);
        product = new ProductPage(page);
        cart = new CartPage(page);
        await page.goto('/');
    });

    test('Debe agregar una Laptop al carrito y verificarla', async ({ page }) => {
        await home.selectCategory('Laptops');
        await home.selectProduct('MacBook air');
        
        // Esperamos explícitamente a que cargue la vista del producto
        await expect(product.addToCartButton).toBeVisible();

        // Interceptamos la alerta nativa de éxito de Demoblaze antes de que ocurra
        page.once('dialog', d => d.accept());

        // Escuchamos la respuesta de la API para asegurarnos de que el backend registro la acción
        const responsePromise = page.waitForResponse(response =>
            response.url().includes('/addtocart') && response.status() === 200
        );
        await product.addToCart();
        await responsePromise; // Garantiza que la promesa de red se resolvió
        
        // Navegamos al carrito
        await page.locator('#cartur').click();

        // ASSERTIONS
        // Filtramos la tabla buscando la fila exacta que contiene nuestro producto
        const item = cart.tableRows.filter({ hasText: /MacBook air/i });
        await expect(item).toBeVisible({ timeout: 20000 }); // Damos un margen por lentitud de la web
    });

    test('Debe eliminar un producto del carrito', async ({ page }) => {
        await home.selectProduct('Samsung galaxy s6');
        await expect(product.addToCartButton).toBeVisible();
        
        page.once('dialog', d => d.accept());
        const addResponse = page.waitForResponse(resp => 
            resp.url().includes('/addtocart') && resp.status() === 200
        );
        
        await product.addToCart();
        await addResponse;
        await page.locator('#cartur').click();

        // Eliminamos el producto específico
        await cart.deleteProduct('Samsung galaxy s6');

        // ASSERTIONS
        // Verificamos que el elemento ya no exista en el DOM
        const item = cart.getProductLocator('Samsung galaxy s6');
        await expect(item).not.toBeVisible();
    });

    test('Debe completar la compra exitosamente', async ({ page }) => {
        await home.selectProduct('Nokia lumia 1520');
        await expect(product.addToCartButton).toBeVisible();
        
        page.once('dialog', d => d.accept());
        const addResponse = page.waitForResponse(resp => 
            resp.url().includes('/addtocart') && resp.status() === 200
        );
        
        await product.addToCart();
        await addResponse;
        
        await page.locator('#cartur').click();
        
        // Esperamos a que la tabla del carrito renderice el producto antes de comprar
        await cart.tableRows.first().waitFor({ state: 'visible' });

        await cart.fillPurchaseForm({
            name: 'Dorian User',
            country: 'Peru',
            city: 'Arequipa',
            card: '1234567890123456',
            month: '12',
            year: '2026'
        });

        // ASSERTIONS
        await expect(cart.successMessage).toContainText('Thank you for your purchase!');
        await page.locator('button:has-text("OK")').click();
    });
});
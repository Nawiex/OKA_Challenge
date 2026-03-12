import { test, expect, Dialog } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { SignUpPage } from '../../pages/SignupPage';
// Importamos la data de prueba desde un archivo externo para aislar la data lógica del código
import userData from '../../data/users.json';

test.describe('Flujos de Autenticación', () => {
    let loginPage: LoginPage;
    let signupPage: SignUpPage;

    test.beforeEach(async ({ page }) => {
        // Inicializamos los Page Objects de forma centralizada para mantener el principio DRY
        loginPage = new LoginPage(page);
        signupPage = new SignUpPage(page);
        await page.goto('/');
    });

    test('Debe crear un usuario nuevo exitosamente y validarlo mediante login', async ({ page }) => {
        // Generamos un username dinámico con Date.now()
        // Esto evita fallos en ejecuciones consecutivas causados por usuarios ya existentes.
        const dynamicUsername = `QA_carlos_${Date.now()}`;
        const password = 'Password123!';

        // Interceptamos la alerta nativa (window.alert) de éxito ANTES de que ocurra la acción.
        // Playwright por defecto cierra estos diálogos; capturarlo nos permite asertar su mensaje.
        page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Sign up successful.');
            await dialog.accept();
        });

        await signupPage.register(dynamicUsername, password);
        
        // Este "hard wait" le da margen a la base de datos para sincronizar antes de intentar el login.
        await page.waitForTimeout(1000); 
        
        await loginPage.login(dynamicUsername, password);

        // Verificamos que la interfaz refleje el estado de autenticación exitosa
        const welcomeText = page.locator('#nameofuser');
        await expect(welcomeText).toBeVisible();
        await expect(welcomeText).toContainText(`Welcome ${dynamicUsername}`);
    });

    test('Debe iniciar sesión exitosamente con credenciales válidas', async () => {
        // Desestructuramos las credenciales válidas desde nuestro JSON de datos
        const { username, password } = userData.validUser;
        await loginPage.login(username, password);

        // assertions
        await expect(loginPage.welcomeMessage).toBeVisible();
        await expect(loginPage.welcomeMessage).toContainText(`Welcome ${username}`);
    });

    test('Debe mostrar alerta de error con credenciales inválidas', async ({ page }) => {
        const { username, password } = userData.invalidUser;

        // Preparamos el listener asíncrono para capturar la alerta de credenciales incorrectas
        page.once('dialog', async (dialog: Dialog) => {
            expect(dialog.message()).toContain('User does not exist.');
            await dialog.accept();
        });

        // Ejecutamos el login. La aserción ocurre dentro del listener del evento 'dialog' definido arriba.
        await loginPage.login(username, password);
    });
});
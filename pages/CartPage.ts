import { Locator, Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly tableRows: Locator;
    readonly totalPrice: Locator;
    readonly placeOrderButton: Locator;

    // Locators del modal de compra (Purchase)
    readonly nameInput: Locator;
    readonly countryInput: Locator;
    readonly cityInput: Locator;
    readonly creditCardInput: Locator;
    readonly monthInput: Locator;
    readonly yearInput: Locator;
    readonly purchaseButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.tableRows = page.locator('#tbodyid tr');
        this.totalPrice = page.locator('#totalp');
        this.placeOrderButton = page.locator('button:has-text("Place Order")');

        // Selectores del modal
        this.nameInput = page.locator('#orderModal #name');
        this.countryInput = page.locator('#orderModal #country');
        this.cityInput = page.locator('#orderModal #city');
        this.creditCardInput = page.locator('#orderModal #card');
        this.monthInput = page.locator('#orderModal #month');
        this.yearInput = page.locator('#orderModal #year');
        this.purchaseButton = page.locator('#orderModal button:has-text("Purchase")');
        this.successMessage = page.locator('.sweet-alert h2');
    }

    getProductLocator(productName: string): Locator {
        return this.tableRows.filter({ hasText: productName });
    }

    async deleteProduct(productName: string) {
        const productRow = this.getProductLocator(productName);
        await productRow.locator('a:has-text("Delete")').click();
        await productRow.waitFor({ state: 'detached' });
    }

    async fillPurchaseForm(details: { name: string, country: string, city: string, card: string, month: string, year: string }) {
        await this.placeOrderButton.click();
        await this.nameInput.waitFor({ state: 'visible' });

        await this.nameInput.fill(details.name);
        await this.countryInput.fill(details.country);
        await this.cityInput.fill(details.city);
        await this.creditCardInput.fill(details.card);
        await this.monthInput.fill(details.month);
        await this.yearInput.fill(details.year);
        await this.purchaseButton.click();
    }
}
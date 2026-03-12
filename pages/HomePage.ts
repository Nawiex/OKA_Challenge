import { Locator, Page } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly categoriesMenu: Locator;

    constructor(page: Page) {
        this.categoriesMenu = page.locator('.list-group');
        this.page = page;
    }

    async selectProduct(productName: string) {
        await this.page.locator(`.card-title a:has-text("${productName}")`).click();
    }

    async selectCategory(categoryName: 'Phones' | 'Laptops' | 'Monitors') {
        await this.page.locator(`a.list-group-item:has-text("${categoryName}")`).click();
        await this.page.locator('.card-title').first().waitFor({ state: 'visible' });
    }
}
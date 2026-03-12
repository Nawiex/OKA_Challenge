import { Locator, Page } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly productNameHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator('a.btn-success:has-text("Add to cart")');
    this.productNameHeader = page.locator('#nameofuser');
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}
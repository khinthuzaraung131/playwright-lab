import { test, expect } from '@playwright/test';

test.describe('Cart workflow: variant, add to cart, quantity', () => {
  test('guest adds size M / Black twice and verifies cart quantity', async ({ page }) => {
    // 1. Click through from the catalog to the Classic T-Shirt
    await page.goto('store');
    await page.getByRole('link', { name: /Classic T-Shirt/i }).first().click();
    await expect(page.getByRole('heading', { name: /Classic T-Shirt/i })).toBeVisible({ timeout: 30_000 });

    // 2. Select a variant
    const sizeM = page.getByRole('button', { name: 'M', exact: true });
    await sizeM.click();
    await page.getByRole('button', { name: 'Black', exact: true }).click();

    // 3. Add to cart and verify the cart summary
    const addToCart = page.getByRole('button', { name: /add to cart/i });
    await expect(addToCart).toBeEnabled();
    await addToCart.click();

    const cartLink = page.getByRole('link', { name: /cart/i }).first();
    await expect(cartLink).toHaveText('Cart (1)', { timeout: 20_000 });
    await expect(page.getByText(/^Quantity:\s*1$/)).toBeVisible();

    // 4. Adding the same variant again increments its cart quantity.
    const subtotal = page.getByTestId('cart-subtotal');
    const before = await subtotal.innerText();
    await addToCart.click();
    await expect(cartLink).toHaveText('Cart (2)', { timeout: 20_000 });
    await expect(page.getByText(/^Quantity:\s*2$/)).toBeVisible();
    await expect(subtotal).not.toHaveText(before);
  });
});
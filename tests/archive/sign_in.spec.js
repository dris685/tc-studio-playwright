import {test, expect} from '@playwright/test'

test.only('Get Submitted Album ID', async ({page}) => {
    await page.goto('https://tc-studio-qa3.tunecore.com')
    //Sign In
    expect(await page).toHaveTitle('TC-Studio')
    await page.locator('#email').fill('test_us1@tunecore.com')
    await page.locator('#password').fill('Test@123')
    await page.locator("button[type='submit']").click()

    //Verify DashboardText on Dashboard Page
    const dashboardText = await page.locator('p.tcstudio-MuiTypography-h5').textContent()
    expect(dashboardText).toEqual("Welcome to Studio, a collection of TuneCore's Admin tools.")
    await page.getByRole('link', { name: 'Content Review', exact: true }).click()

})
import {test, expect, chromium} from '@playwright/test'
import { executeQuery } from '../db_connection/database'

test('Verify Review Audits Section', async ({}) => {

    const browser = await chromium.launch()
    const context = await browser.newContext()
    const tabOneWWW = await context.newPage()
    const tabStudio = await context.newPage()

    // Land on TC-WWW Site
    await tabOneWWW.goto('https://staging.tunecore.com/login?check=1')
    
    // Sign In on TC-WWW Site
    await expect(await tabOneWWW).toHaveTitle('TuneCore Login - Sign in to Your TuneCore Artist Account | TuneCore | TuneCore')
    await tabOneWWW.locator('#person_email').fill('test_us1@tunecore.com')
    await tabOneWWW.locator('#person_password').fill('Test@123')
    await tabOneWWW.locator('#login-button').click()
    const usernameOnDashboard = await tabOneWWW.locator('#admin-controls nav strong')
    await expect(await usernameOnDashboard.textContent()).toEqual('test_admin1.')
    const dashboardOnDashboard = await tabOneWWW.locator('#admin-controls nav ul li').nth(0)
    await expect(await dashboardOnDashboard.textContent()).toEqual('Dashboard')

    //Sign In on TC-STUDIO Site
    await tabStudio.goto('https://tc-studio-staging.tunecore.com')
    await expect(await tabStudio).toHaveTitle('TC-Studio')
    await tabStudio.locator('#email').fill('test_us1@tunecore.com')
    await tabStudio.locator('#password').fill('Test@123')
    await tabStudio.locator("button[type='submit']").click()

    // Verify DashboardText on Dashboard Page (TC-STUDIO)
    const dashboardTitle = await tabStudio.locator('p.tcstudio-MuiTypography-h5')
    expect(await dashboardTitle.textContent()).toEqual("Welcome to Studio, a collection of TuneCore's Admin tools.")

    // Review Specific Album ID on Content Review Page (TC-STUDIO)
    const albumID = '7811637'
    await tabStudio.goto(`https://tc-studio-staging.tunecore.com/content_review/details_view/${albumID}`)
    const albumIDWebelement = await tabStudio.locator('.tcstudio-MuiGrid-container > .tcstudio-MuiGrid-container:nth-child(2) > div:nth-child(2) p')
    await expect(await albumIDWebelement.textContent()).toEqual(albumID)

    // Verify Review Audits on Content Review Page (TC-STUDIO)
    const reviewAuditsTitleOnTCStudio = await tabStudio.locator('#tableTitle')
    await expect(await reviewAuditsTitleOnTCStudio.textContent()).toEqual('Review Audits')
    const albumLegalReviewState = await executeQuery(`
        SELECT legal_review_state
        FROM albums
        WHERE id = 7811637`
    )
    const albumLegalReviewStateInDB = albumLegalReviewState[0].legal_review_state
    const albumReviewAuditsStatusOnTCStudio = await tabStudio.locator('table.tcstudio-MuiTable-root tbody tr').nth(0).locator('p')
    await expect(await albumReviewAuditsStatusOnTCStudio.textContent()).toEqual(albumLegalReviewStateInDB)
    const albumReviewAuditsReviewerOnTCStudio = await tabStudio.locator('table.tcstudio-MuiTable-root tbody tr').nth(0).locator('td').nth(1)
    await expect(await albumReviewAuditsReviewerOnTCStudio.textContent()).toEqual('Corey Powell')
    const albumReviewAuditsReviewedAtOnTCStudio = await tabStudio.locator('table.tcstudio-MuiTable-root tbody tr').nth(0).locator('td').nth(2)
    await expect(await albumReviewAuditsReviewedAtOnTCStudio.textContent()).toEqual('05/31/2024 07:42')

    // Click on Album Name on Content Review Page (TC-STUDIO)
    const pagePromise = context.waitForEvent('page')
    const albumNameOnTcStudio = await tabStudio.locator('.tcstudio-jss24 .tcstudio-MuiCardHeader-content a')
    await expect(await albumNameOnTcStudio.textContent()).toEqual('Patience')
    await albumNameOnTcStudio.click()
    
    // Land on TC-WWW Site
    const tabTwoWWW = await pagePromise

    // Verify Review Audits on Admin Page (TC-WWW)
    const reviewAuditsTitleOnTCWWW = await tabTwoWWW.locator('.alpha > div.title-box:nth-child(19) h3')
    await expect(await reviewAuditsTitleOnTCWWW.textContent()).toEqual('Review Audits')
    const albumReviewAuditsReviewedAtOnTCWWW = await tabTwoWWW.locator('.alpha > div.title-box:nth-child(19) > dd:nth-child(8)')
    await expect(((await albumReviewAuditsReviewedAtOnTCWWW.textContent()).trim()).slice(0,((await albumReviewAuditsReviewedAtOnTCWWW.textContent()).trim()).lastIndexOf(':'))).toEqual('2024-05-31 07:42')
    const albumReviewAuditsStatusOnTCWWW = await tabTwoWWW.locator('.alpha > div.title-box:nth-child(19) > dd:nth-child(8)')
    await expect(((((await albumReviewAuditsStatusOnTCWWW.textContent()).split('\n')[2]).trim()).split(' ')[1]).toUpperCase()).toEqual('APPROVED')
    const albumReviewAuditsReviewerOnTCWWW = await tabTwoWWW.locator('.alpha > div.title-box:nth-child(19) > dd:nth-child(8)')
    await expect(((await albumReviewAuditsReviewerOnTCWWW.textContent()).split('\n')[3]).trim()).toEqual('Corey Powell')
})
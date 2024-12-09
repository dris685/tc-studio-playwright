import {test, expect, chromium} from '@playwright/test'
import { executeQuery } from '../db_connection/database'

test('Verify Customer Account', async ({}) => {

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

    // Verify DashboardText on Dashboard Page (TC_STUDIO)
    const dashboardText = await tabStudio.locator('p.tcstudio-MuiTypography-h5').textContent()
    expect(dashboardText).toEqual("Welcome to Studio, a collection of TuneCore's Admin tools.")

    // Review Specific Album ID on Content Review Page (TC_STUDIO)
    const albumID = '7811637'
    await tabStudio.goto(`https://tc-studio-staging.tunecore.com/content_review/details_view/${albumID}`)
    const albumIDWebelement = await tabStudio.locator('.tcstudio-MuiGrid-container > .tcstudio-MuiGrid-container:nth-child(2) > div:nth-child(2) p')
    await expect(await albumIDWebelement.textContent()).toEqual(albumID)

    // Verify Account Name Info on Content Review Page (TC_STUDIO)
    const customerAccount = await tabStudio.locator('.tcstudio-jss60 span')
    await expect(await customerAccount.textContent()).toEqual('Customer Account')
    const accountNameOnTcStudio = await tabStudio.locator('.tcstudio-jss61 .tcstudio-MuiGrid-item:nth-child(2) .tcstudio-MuiTypography-body2:nth-child(1) a')
    await expect(await accountNameOnTcStudio.textContent()).toEqual('Sidhant Chitkara')
    const accountEmailOnTcStudio = await tabStudio.locator('.tcstudio-jss61 .tcstudio-MuiGrid-item:nth-child(2) .tcstudio-MuiTypography-body2:nth-child(2)')
    await expect(await accountEmailOnTcStudio.textContent()).toEqual('tc_4457807@tunecore.net')
    const personIdOnTcStudio = await tabStudio.locator('.tcstudio-jss61 .tcstudio-MuiGrid-item:nth-child(2) .tcstudio-MuiTypography-body2:nth-child(3)')
    await expect(await personIdOnTcStudio.textContent()).toEqual('4457807')
    const accountStatusOnTcStudio = await tabStudio.locator('.tcstudio-jss61 .tcstudio-MuiGrid-item:nth-child(2) .tcstudio-MuiTypography-body2:nth-child(4)')
    await expect(await accountStatusOnTcStudio.textContent()).toEqual('Active')
    const accountCreatedOnTcStudio = await tabStudio.locator('.tcstudio-jss61 .tcstudio-MuiGrid-item:nth-child(2) .tcstudio-MuiTypography-body2:nth-child(5)')
    await expect(await accountCreatedOnTcStudio.textContent()).toEqual('08/22/2022 10:04')
    const accountCountryOnTcStudio = await tabStudio.locator('.tcstudio-jss61 .tcstudio-MuiGrid-item:nth-child(2) .tcstudio-MuiTypography-body2:nth-child(6)')
    await expect(await accountCountryOnTcStudio.textContent()).toEqual('United States')
    const countryWebsiteOnTcStudio = await tabStudio.locator('.tcstudio-jss61 .tcstudio-MuiGrid-item:nth-child(2) .tcstudio-MuiTypography-body2:nth-child(7)')
    await expect(await countryWebsiteOnTcStudio.textContent()).toEqual('US')
    const siftScoreOnTcStudio = await tabStudio.locator('div .tcstudio-jss66')
    await expect((await siftScoreOnTcStudio.textContent()).slice(0,10)).toEqual('SIFT SCORE')
    const scoreNum = await executeQuery(`
        SELECT score
        FROM person_sift_scores
        WHERE person_id = '4457807'`
    )
    const scoreNumInDB = Math.round(parseFloat(scoreNum[0].score)*100)
    const siftScoreNumberOnTcStudio = await tabStudio.locator('div .tcstudio-jss65')
    await expect(await siftScoreNumberOnTcStudio.textContent()).toEqual(scoreNumInDB.toString())
    const vipTagOnTcStudio = await tabStudio.locator('.tcstudio-jss61 .tcstudio-MuiGrid-item:nth-child(3) span:nth-child(1)')
    await expect(await vipTagOnTcStudio.textContent()).toEqual('VIP')

    // Click on Account Name on Content Review Page (TC_STUDIO)
    const pagePromise = context.waitForEvent('page')
    await accountNameOnTcStudio.click()

    // Land on TC-WWW Site
    const tabTwoWWW = await pagePromise

    // Verify Account Name Info on Admin Page (TC_WWW)
    await tabTwoWWW.waitForSelector('#admin-wrapper section dt a')
    const accountNameOnTcWWW = await tabTwoWWW.locator('#admin-wrapper section dt a')
    await expect(await accountNameOnTcWWW.textContent()).toEqual('Sidhant Chitkara')
    const accountEmailOnTcWWW = await tabTwoWWW.locator('.alpha.omega > div > dl > dd > a')
    await expect(await accountEmailOnTcWWW.textContent()).toEqual('tc_4457807@tunecore.net')
    const accountStatusOnTcWWW = await tabTwoWWW.locator('.alpha.omega > div > dl > dd.user_status_active')
    await expect((await accountStatusOnTcWWW.textContent()).trim()).toEqual('Active')
    const vipTagOnTcWWW = await tabTwoWWW.locator('.alpha.omega > div > dl > dd:nth-child(4)')
    await expect((await vipTagOnTcWWW.textContent()).trim().slice(0,3)).toEqual('VIP')
    const accountCreatedOnTcWWW = await tabTwoWWW.locator('.alpha.omega > div > dl > dd:nth-child(6) b')
    await expect(await accountCreatedOnTcWWW.textContent()).toEqual('22 Aug 2022')
    const accountCountryOnTcWWW = await tabTwoWWW.locator('.alpha.omega > div > dl > dd:nth-child(13) b')
    await expect(await accountCountryOnTcWWW.textContent()).toEqual('United States')
    const countryWebsiteOnTcWWW = await tabTwoWWW.locator('.alpha.omega > div > dl > dd:nth-child(14) b')
    await expect(await countryWebsiteOnTcWWW.textContent()).toEqual('US')
})
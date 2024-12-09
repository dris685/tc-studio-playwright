import {test, expect, chromium} from '@playwright/test'
import { executeQuery } from '../db_connection/database'

test('Verify Album Section', async ({}) => {

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
    const dashboardText = await tabStudio.locator('p.tcstudio-MuiTypography-h5').textContent()
    expect(dashboardText).toEqual("Welcome to Studio, a collection of TuneCore's Admin tools.")

    // Review Specific Album ID on Content Review Page (TC-STUDIO)
    const albumID = '7811637'
    await tabStudio.goto(`https://tc-studio-staging.tunecore.com/content_review/details_view/${albumID}`)
    const albumIDWebelement = await tabStudio.locator('.tcstudio-MuiGrid-container > .tcstudio-MuiGrid-container:nth-child(2) > div:nth-child(2) p')
    await expect(await albumIDWebelement.textContent()).toEqual(albumID)

    // Verify Album Info on Content Review Page (TC-STUDIO)
    const artworkOnTcStudio = await tabStudio.locator('div.tcstudio-MuiCardMedia-root img')
    await expect(await artworkOnTcStudio.getAttribute('alt')).toEqual('artwork')
    const albumNameOnTcStudio = await tabStudio.locator('.tcstudio-jss24 .tcstudio-MuiCardHeader-content a')
    await expect(await albumNameOnTcStudio.textContent()).toEqual('Patience')
    const primaryArtistNameOnTcStudio = await tabStudio.locator('.tcstudio-jss38 .tcstudio-MuiTypography-body2')
    await expect(await primaryArtistNameOnTcStudio.textContent()).toEqual('Sid Kara')
    const albumIdOnTcStudio = await tabStudio.locator('.tcstudio-jss32 > .tcstudio-MuiGrid-container > .tcstudio-MuiGrid-container:nth-child(2) > .tcstudio-MuiGrid-item:nth-child(2) .tcstudio-MuiTypography-body2')
    await expect(await albumIdOnTcStudio.textContent()).toEqual('7811637')
    const upcNumInDB = await executeQuery(`
        SELECT number
        FROM upcs
        WHERE upcable_id = 7811637
        AND upcable_type = 'Album'
        AND upc_type = 'tunecore'`
    )
    const upcNumberOnTcStudio = await tabStudio.locator('.tcstudio-jss32 > .tcstudio-MuiGrid-container > .tcstudio-MuiGrid-container:nth-child(2) > .tcstudio-MuiGrid-item:nth-child(4) .tcstudio-MuiTypography-body2')
    await expect(await upcNumberOnTcStudio.textContent()).toEqual(upcNumInDB[0].number)
    const labelNameOnTcStudio = await tabStudio.locator('.tcstudio-jss32 > .tcstudio-MuiGrid-container > .tcstudio-MuiGrid-container:nth-child(3) > .tcstudio-MuiGrid-item:nth-child(2) .tcstudio-MuiTypography-body2')
    await expect(await labelNameOnTcStudio.textContent()).toEqual('Sid Kara')
    const albumCreatedOnTcStudio = await tabStudio.locator('.tcstudio-jss46 > .tcstudio-MuiTypography-body2:nth-child(1)')
    await expect(await albumCreatedOnTcStudio.textContent()).toEqual('2024-05-29')
    const albumReleasedOnTcStudio = await tabStudio.locator('.tcstudio-jss46 > .tcstudio-MuiTypography-body2:nth-child(3)')
    await expect((await albumReleasedOnTcStudio.textContent()).slice(0,10)).toEqual('2024-06-06')
    const releaseTypeOnTcStudio = await tabStudio.locator('.tcstudio-jss47 > .tcstudio-MuiTypography-body2:nth-child(1)')
    await expect(await releaseTypeOnTcStudio.textContent()).toEqual('Album')
    const primaryGenreOnTcStudio = await tabStudio.locator('.tcstudio-jss47 > .tcstudio-MuiTypography-body2:nth-child(2)')
    await expect(await primaryGenreOnTcStudio.textContent()).toEqual('Hip Hop/Rap')
    const secondaryGenreOnTcStudio = await tabStudio.locator('.tcstudio-jss47 > .tcstudio-MuiTypography-body2:nth-child(4)')
    await expect(await secondaryGenreOnTcStudio.textContent()).toEqual('Dance')
    const metadataLanguageOnTcStudio = await tabStudio.locator('.tcstudio-jss48 > .tcstudio-MuiTypography-body2:nth-child(2)')
    await expect(await metadataLanguageOnTcStudio.textContent()).toEqual('English')
    
    // Click on Album Name on Content Review Page (TC-STUDIO)
    const pagePromise = context.waitForEvent('page')
    await albumNameOnTcStudio.click()

    // Land on TC-WWW Site
    const tabTwoWWW = await pagePromise

    // Verify Album Info on Admin Page (TC-WWW)
    await expect(tabTwoWWW).toHaveTitle('Admin: Album: Patience')
    const artworkOnTcWWW = await tabTwoWWW.locator('.admin-album-img')
    await expect(await artworkOnTcWWW.getAttribute('alt')).toEqual('Patience Cover')
    const albumNameOnTcWWW = await tabTwoWWW.locator('#admin-wrapper > h2')
    await expect((await albumNameOnTcWWW.textContent()).slice((await albumNameOnTcWWW.textContent()).indexOf(':')+2)).toEqual('Patience')
    const releaseTypeOnTcWWW = await tabTwoWWW.locator('#admin-wrapper > h2')
    await expect((await releaseTypeOnTcWWW.textContent()).slice(0, (await releaseTypeOnTcWWW.textContent()).indexOf(':'))).toEqual('Album')
    const primaryArtistNameOnTcWWW = await tabTwoWWW.locator('dd.artist > strong:nth-child(1)')
    await expect(await primaryArtistNameOnTcWWW.textContent()).toEqual('Sid Kara')
    const labelNameOnTcWWW = await tabTwoWWW.locator('dd.artist > strong:nth-child(3)')
    await expect((await labelNameOnTcWWW.textContent())).toEqual('Sid Kara')
    const albumIdOnTcWWW = await tabTwoWWW.locator('.alpha > .title-box:nth-child(6) h3')
    await expect((await albumIdOnTcWWW.textContent()).slice((await albumIdOnTcWWW.textContent()).indexOf(':')+3)).toEqual('7811637')
    const upcNumberOnTcWWW = await tabTwoWWW.locator('#new_tc_upcX')
    await expect((await upcNumberOnTcWWW.textContent()).slice(0,(await upcNumberOnTcWWW.textContent()).length-1)).toEqual('859789054311')
    const albumCreatedOnTcWWW = await tabTwoWWW.locator('div .alpha > .title-box:nth-child(10) > dd:nth-child(2)')
    await expect((await albumCreatedOnTcWWW.textContent()).slice((await albumCreatedOnTcWWW.textContent()).indexOf(':')+2)).toEqual('2024-05-29')
    const albumReleasedOnTcWWW = await tabTwoWWW.locator('span.edit_golive_date')
    await expect((await albumReleasedOnTcWWW.textContent()).trim()).toEqual('2024-06-06')
    const primaryGenreOnTcWWW = await tabTwoWWW.locator('.alpha > div.title-box:nth-child(6) > dd:nth-child(14)')
    await expect((await primaryGenreOnTcWWW.textContent()).slice((await primaryGenreOnTcWWW.textContent()).indexOf(':')+2,(await primaryGenreOnTcWWW.textContent()).indexOf(','))).toEqual('Hip Hop/Rap')
    const secondaryGenreOnTcWWW = await tabTwoWWW.locator('.alpha > div.title-box:nth-child(6) > dd:nth-child(15)')
    await expect((await secondaryGenreOnTcWWW.textContent()).slice((await secondaryGenreOnTcWWW.textContent()).indexOf(':')+2,(await secondaryGenreOnTcWWW.textContent()).indexOf(','))).toEqual('Dance')
    const metadataLanguageOnTcWWW = await tabTwoWWW.locator('.alpha > div.title-box:nth-child(6) > dd:nth-child(12)')
    await expect((await metadataLanguageOnTcWWW.textContent()).slice((await metadataLanguageOnTcWWW.textContent()).indexOf(':')+2,(await metadataLanguageOnTcWWW.textContent()).indexOf('(')-1)).toEqual('English')
})
import { test, expect, chromium } from '@playwright/test'
import { executeQuery } from '../db_connection/database'
import { LoginPageWWW } from '../../pages/tc-www/LoginPageWWW'
import { DashboardPageWWW } from '../../pages/tc-www/DashboardPageWWW'
import { LoginPageCRT } from '../../pages/tc-studio/LoginPageCRT'
import { DashboardPageCRT } from '../../pages/tc-studio/DashboardPageCRT'
import { ContentReviewPageCRT } from '../../pages/tc-studio/ContentReviewPageCRT'
import { AlbumAdminPageWWW } from '../../pages/tc-www/AlbumAdminPageWWW'
import loginDataWWW from '../../testdata/tc-www/LoginDataWWW.json'
import dashboardDataWWW from '../../testdata/tc-www/DashboardDataWWW.json'
import albumAdminDataWWW from '../../testdata/tc-www/AlbumAdminDataWWW.json'
import loginDataCRT from '../../testdata/tc-studio/LoginDataCRT.json'
import dashboardDataCRT from '../../testdata/tc-studio/DashboardDataCRT.json'
import contentReviewDataCRT from '../../testdata/tc-studio/ContentReviewDataCRT.json'
import { decryptData } from '../../utilities/encrypt_decrypt_data'

test.describe('Review Audits Suite', () => {
  let browser
  let context

  test.beforeAll(async () => {
    // Launch browser and create context before all tests
    browser = await chromium.launch()
    context = await browser.newContext()
  })


  test('Verify Album Section', async ({ }) => {

    const tabOneWWW = await context.newPage()
    const tabStudio = await context.newPage()

    // Land on TC-WWW Site
    const loginPageWWW = new LoginPageWWW(tabOneWWW)
    await loginPageWWW.navigate(process.env.URL_WWW_LOGIN)
    await loginPageWWW.hasTitle(loginDataWWW.title)

    // Sign In on TC-WWW Site
    const decryptedUserEmailWWW = decryptData(process.env.ENCRYPTED_USEREMAIL_WWW)
    const decryptedPasswordWWW = decryptData(process.env.ENCRYPTED_PASSWORD_WWW)
    await loginPageWWW.enterUserEmail(decryptedUserEmailWWW)
    await loginPageWWW.enterPassword(decryptedPasswordWWW)
    await loginPageWWW.clickOnLoginButton()
    const dashboardPageWWW = new DashboardPageWWW(tabOneWWW)
    expect(await dashboardPageWWW.getUsernameText()).toEqual(dashboardDataWWW.usernameText)
    expect(await dashboardPageWWW.getDashboardText()).toEqual(dashboardDataWWW.dashboardText)

    //Sign In on TC-STUDIO Site
    const loginPageCRT = new LoginPageCRT(tabStudio)
    await loginPageCRT.navigate(process.env.URL_CRT_LOGIN)
    await loginPageCRT.hasTitle(loginDataCRT.title)
    const decryptedUsernameCRT = decryptData(process.env.ENCRYPTED_USERNAME_CRT)
    const decryptedPasswordCRT = decryptData(process.env.ENCRYPTED_PASSWORD_CRT )
    await loginPageCRT.enterUsername(decryptedUsernameCRT)
    await loginPageCRT.enterPassword(decryptedPasswordCRT)
    await loginPageCRT.clickOnLoginButton()

    // Verify DashboardText on Dashboard Page (TC-STUDIO)
    const dashboardPageCRT = new DashboardPageCRT(tabStudio)
    expect(await dashboardPageCRT.getDashboardText()).toEqual(dashboardDataCRT.dashboardText)

    // Review Specific Album ID on Content Review Page (TC-STUDIO)
    await dashboardPageCRT.navigate(process.env.URL_CRT_CONTENTREVIEW + `/` + `${contentReviewDataCRT.albumID}`)
    const contentReviewPageCRT = new ContentReviewPageCRT(tabStudio)
    // expect(await contentReviewPageCRT.getAlbumIDText()).toEqual(contentReviewDataCRT.albumID)

    // Verify Album Info on Content Review Page (TC-STUDIO)
    // expect(await contentReviewPageCRT.getArtworkAttribute()).toEqual(contentReviewDataCRT.artworkAttribute)
    // expect(await contentReviewPageCRT.getAlbumNameText()).toEqual(contentReviewDataCRT.albumNameText)
    // expect(await contentReviewPageCRT.getPrimaryArtistNameText()).toEqual(contentReviewDataCRT.primaryArtistNameText)
    // expect(await contentReviewPageCRT.getAlbumIDText()).toEqual(contentReviewDataCRT.albumID)
    // 67-74
    const upcNumInDB = await executeQuery(`
        SELECT number
        FROM upcs
        WHERE upcable_id = ${contentReviewDataCRT.albumID}
        AND upcable_type = 'Album'
        AND upc_type = 'tunecore'`
    )
    expect(await contentReviewPageCRT.getUPCNumberText()).toEqual(upcNumInDB[0].number)
    expect(await contentReviewPageCRT.getLabelNameText()).toEqual(contentReviewDataCRT.labelNameText)
    expect(await contentReviewPageCRT.getAlbumCreatedText()).toEqual(contentReviewDataCRT.albumCreatedText)
    expect(await contentReviewPageCRT.getAlbumReleasedText()).toEqual(contentReviewDataCRT.albumReleasedText)
    expect(await contentReviewPageCRT.getReleaseTypeText()).toEqual(contentReviewDataCRT.releaseTypeText)
    expect(await contentReviewPageCRT.getPrimaryGenreText()).toEqual(contentReviewDataCRT.primaryGenreText)
    expect(await contentReviewPageCRT.getSecondaryGenreText()).toEqual(contentReviewDataCRT.secondaryGenreText)
    expect(await contentReviewPageCRT.getMetadataLanguageText()).toEqual(contentReviewDataCRT.metadataLanguageText)

    // Click on Album Name on Content Review Page (TC-STUDIO)
    const pagePromise = context.waitForEvent('page')
    expect(await contentReviewPageCRT.getAlbumNameText()).toEqual(contentReviewDataCRT.albumNameText)
    await contentReviewPageCRT.clickOnAlbumNameText()

    // Land on TC-WWW Site
    const tabTwoWWW = await pagePromise
    const albumAdminPageWWW = new AlbumAdminPageWWW(tabTwoWWW)
    await albumAdminPageWWW.hasTitle(albumAdminDataWWW.title)

    // Verify Album Info on Admin Page (TC-WWW)
    expect(await albumAdminPageWWW.getArtworkAttribute()).toEqual(albumAdminDataWWW.artworkAttribute)
    expect(await albumAdminPageWWW.getAlbumNameText()).toEqual(albumAdminDataWWW.albumNameText)
    expect(await albumAdminPageWWW.getReleaseTypeText()).toEqual(albumAdminDataWWW.releaseTypeText)
    expect(await albumAdminPageWWW.getPrimaryArtistNameText()).toEqual(albumAdminDataWWW.primaryArtistNameText)
    expect(await albumAdminPageWWW.getlabelNameText()).toEqual(albumAdminDataWWW.labelNameText)
    expect(await albumAdminPageWWW.getAlbumIdText()).toEqual(albumAdminDataWWW.albumID)
    expect(await albumAdminPageWWW.getUPCNumberText()).toEqual(albumAdminDataWWW.UPCNumberText)
    expect(await albumAdminPageWWW.getAlbumCreatedText()).toEqual(albumAdminDataWWW.albumCreatedText)
    expect(await albumAdminPageWWW.getAlbumReleasedText()).toEqual(albumAdminDataWWW.albumReleasedText)
    expect(await albumAdminPageWWW.getPrimaryGenreText()).toEqual(albumAdminDataWWW.primaryGenreText)
    expect(await albumAdminPageWWW.getSecondaryGenreText()).toEqual(albumAdminDataWWW.secondaryGenreText)
    expect(await albumAdminPageWWW.getMetadataLanguageText()).toEqual(albumAdminDataWWW.metadataLanguageText)
  })


  test.afterAll(async () => {
    await browser.close()
  })
  
})
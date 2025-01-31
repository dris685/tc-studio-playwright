import { test, expect, chromium } from '@playwright/test'
import { executeQueryEC2 } from '../db_connection/database_EC2'
import { executeQueryRDS } from '../db_connection/database_RDS'
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

  
  test('Verify Review Audits Section', async ({}) => {
    const tabOneWWW = await context.newPage()
    const tabStudio = await context.newPage()

    // Land on TC-WWW Site
    const loginPageWWW = new LoginPageWWW(tabOneWWW)
    await loginPageWWW.navigate(process.env.URL_WWW_LOGIN)
    await loginPageWWW.hasTitle(loginDataWWW.title)

    // Sign In on TC-WWW Site
    const decryptedUserEmailWWW = decryptData(process.env.ENCRYPTED_USEREMAIL_WWW,process.env.SECRET_KEY)
    const decryptedPasswordWWW = decryptData(process.env.ENCRYPTED_PASSWORD_WWW,process.env.SECRET_KEY)
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
    const decryptedUsernameCRT = decryptData(process.env.ENCRYPTED_USERNAME_CRT,process.env.SECRET_KEY)
    const decryptedPasswordCRT = decryptData(process.env.ENCRYPTED_PASSWORD_CRT,process.env.SECRET_KEY)
    await loginPageCRT.enterUsername(decryptedUsernameCRT)
    await loginPageCRT.enterPassword(decryptedPasswordCRT)
    await loginPageCRT.clickOnLoginButton()

    // Verify DashboardText on Dashboard Page (TC-STUDIO)
    const dashboardPageCRT = new DashboardPageCRT(tabStudio)
    expect(await dashboardPageCRT.getDashboardText()).toEqual(dashboardDataCRT.dashboardText)

    // Review Specific Album ID on Content Review Page (TC-STUDIO)
    await dashboardPageCRT.navigate(process.env.URL_CRT_CONTENTREVIEW + `/` + `${contentReviewDataCRT.albumID}`)
    const contentReviewPageCRT = new ContentReviewPageCRT(tabStudio)
    expect(await contentReviewPageCRT.getAlbumIDText()).toEqual(contentReviewDataCRT.albumID)

    // Verify Review Audits on Content Review Page (TC-STUDIO)
    expect(await contentReviewPageCRT.getReviewAuditsTitleText()).toEqual(contentReviewDataCRT.reviewAuditsTitleText)
    // 63-69
    const albumLegalReviewState = await executeQueryRDS(`
        SELECT legal_review_state
        FROM albums
        WHERE id = ${await contentReviewPageCRT.getAlbumIDText()}`
    )
    // const albumLegalReviewStateInDB = albumLegalReviewState[0].legal_review_state
    const albumLegalReviewStateInDB = albumLegalReviewState[0][0].legal_review_state
    expect(await contentReviewPageCRT.getAlbumReviewAuditsStatusText()).toEqual(albumLegalReviewStateInDB)
    expect(await contentReviewPageCRT.getAlbumReviewAuditsReviewerText()).toEqual(contentReviewDataCRT.albumReviewAuditsReviewerText)
    expect(await contentReviewPageCRT.getAlbumReviewAuditsReviewedAtText()).toEqual(contentReviewDataCRT.albumReviewAuditsReviewedAtText)

    // Click on Album Name on Content Review Page (TC-STUDIO)
    const pagePromise = context.waitForEvent('page')
    expect(await contentReviewPageCRT.getAlbumNameText()).toEqual(contentReviewDataCRT.albumNameText)
    await contentReviewPageCRT.clickOnAlbumNameText()

    // Land on TC-WWW Site
    const tabTwoWWW = await pagePromise

    // Verify Review Audits on Admin Page (TC-WWW)
    const albumAdminPageWWW = new AlbumAdminPageWWW(tabTwoWWW)
    await albumAdminPageWWW.hasTitle(albumAdminDataWWW.title)
    expect(await albumAdminPageWWW.getReviewAuditsTitleText()).toEqual(albumAdminDataWWW.reviewAuditsTitleText)
    expect(await albumAdminPageWWW.getAlbumReviewAuditsReviewedAtText()).toEqual(albumAdminDataWWW.albumReviewAuditsReviewedAtText)
    expect(await albumAdminPageWWW.getAlbumReviewAuditsStatusText()).toEqual(albumAdminDataWWW.albumReviewAuditsStatusText)
    expect(await albumAdminPageWWW.getAlbumReviewAuditsReviewerText()).toEqual(albumAdminDataWWW.albumReviewAuditsReviewerText)
  })


  test.afterAll(async () => {
    await browser.close()
  })

})
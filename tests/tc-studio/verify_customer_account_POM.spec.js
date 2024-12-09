import { test, expect, chromium } from '@playwright/test'
import { executeQuery } from '../db_connection/database'
import { LoginPageWWW } from '../../pages/tc-www/LoginPageWWW'
import { DashboardPageWWW } from '../../pages/tc-www/DashboardPageWWW'
import { LoginPageCRT } from '../../pages/tc-studio/LoginPageCRT'
import { DashboardPageCRT } from '../../pages/tc-studio/DashboardPageCRT'
import { ContentReviewPageCRT } from '../../pages/tc-studio/ContentReviewPageCRT'
import { AdminPageWWW } from '../../pages/tc-www/AdminPageWWW'
import loginDataWWW from '../../testdata/tc-www/LoginDataWWW.json'
import dashboardDataWWW from '../../testdata/tc-www/DashboardDataWWW.json'
import adminDataWWW from '../../testdata/tc-www/AdminDataWWW.json'
import loginDataCRT from '../../testdata/tc-studio/LoginDataCRT.json'
import dashboardDataCRT from '../../testdata/tc-studio/DashboardDataCRT.json'
import contentReviewDataCRT from '../../testdata/tc-studio/ContentReviewDataCRT.json'
import { decryptData } from '../../utilities/encrypt_decrypt_data'

test.describe('Customer Account Suite', () => {
  let browser
  let context

  test.beforeAll(async () => {
    // Launch browser and create context before all tests
    browser = await chromium.launch()
    context = await browser.newContext()
  })


  test('Verify Customer Account', async ({ }) => {

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

    // Verify DashboardText on Dashboard Page (TC_STUDIO)
    const dashboardPageCRT = new DashboardPageCRT(tabStudio)
    expect(await dashboardPageCRT.getDashboardText()).toEqual(dashboardDataCRT.dashboardText)

    // Review Specific Album ID on Content Review Page (TC_STUDIO)
    await dashboardPageCRT.navigate(process.env.URL_CRT_CONTENTREVIEW + `/` + `${contentReviewDataCRT.albumID}`)
    const contentReviewPageCRT = new ContentReviewPageCRT(tabStudio)
    expect(await contentReviewPageCRT.getAlbumIDText()).toEqual(contentReviewDataCRT.albumID)

    // Verify Account Name Info on Content Review Page (TC_STUDIO)
    expect(await contentReviewPageCRT.getCustomerAccountText()).toEqual(contentReviewDataCRT.customerAccountText)
    expect(await contentReviewPageCRT.getAccountNameText()).toEqual(contentReviewDataCRT.accountNameText)
    expect(await contentReviewPageCRT.getAccountEmailText()).toEqual(contentReviewDataCRT.accountEmailText)
    expect(await contentReviewPageCRT.getPersonIdText()).toEqual(contentReviewDataCRT.personIdText)
    expect(await contentReviewPageCRT.getAccountStatusText()).toEqual(contentReviewDataCRT.accountStatusText)
    expect(await contentReviewPageCRT.getAccountCreatedText()).toEqual(contentReviewDataCRT.accountCreatedText)
    expect(await contentReviewPageCRT.getAccountCountryText()).toEqual(contentReviewDataCRT.accountCountryText)
    expect(await contentReviewPageCRT.getCountryWebsiteText()).toEqual(contentReviewDataCRT.countryWebsiteText)
    expect(await contentReviewPageCRT.getSiftScoreText()).toEqual(contentReviewDataCRT.siftScoreText)
    // 72-78
    const scoreNum = await executeQuery(`
        SELECT score
        FROM person_sift_scores
        WHERE person_id = ${await contentReviewPageCRT.getPersonIdText()}`
    )
    const scoreNumInDB = Math.round(parseFloat(scoreNum[0].score)*100)
    expect(await contentReviewPageCRT.getSiftScoreNumberText()).toEqual(scoreNumInDB.toString())
    expect(await contentReviewPageCRT.getVipTagText()).toEqual(contentReviewDataCRT.vipTagText)

    // Click on Account Name on Content Review Page (TC_STUDIO)
    const pagePromise = context.waitForEvent('page')
    expect(await contentReviewPageCRT.getAccountNameText()).toEqual(contentReviewDataCRT.accountNameText)
    await contentReviewPageCRT.clickOnAccountNameText()

    // Land on TC-WWW Site
    const tabTwoWWW = await pagePromise

    // Verify Account Name Info on Admin Page (TC_WWW)
    const adminPageWWW = new AdminPageWWW(tabTwoWWW)
    expect(await adminPageWWW.getAccountNameText()).toEqual(adminDataWWW.accountNameText)
    expect(await adminPageWWW.getAccountEmailText()).toEqual(adminDataWWW.accountEmailText)
    expect(await adminPageWWW.getAccountStatusText()).toEqual(adminDataWWW.accountStatusText)
    expect(await adminPageWWW.getVipTagText()).toEqual(adminDataWWW.vipTagText)
    expect(await adminPageWWW.getAccountCreatedText()).toEqual(adminDataWWW.accountCreatedText)
    expect(await adminPageWWW.getAccountCountryText()).toEqual(adminDataWWW.accountCountryText)
    expect(await adminPageWWW.getCountryWebsiteText()).toEqual(adminDataWWW.countryWebsiteText)
  })


  test.afterAll(async () => {
    await browser.close()
  })
  
})
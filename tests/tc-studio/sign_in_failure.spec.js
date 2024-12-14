import { test, expect, chromium } from '@playwright/test'
import { LoginPageCRT } from '../../pages/tc-studio/LoginPageCRT'
import { DashboardPageCRT } from '../../pages/tc-studio/DashboardPageCRT'
import { ContentReviewPageCRT } from '../../pages/tc-studio/ContentReviewPageCRT'
import loginDataCRT from '../../testdata/tc-studio/LoginDataCRT.json'
import dashboardDataCRT from '../../testdata/tc-studio/DashboardDataCRT.json'
import { decryptData } from '../../utilities/encrypt_decrypt_data'

test.describe('Sign In Failure Suite', () => {
  let browser
  let context

  test.beforeAll(async () => {
    // Launch browser and create context before all tests
    browser = await chromium.launch()
    context = await browser.newContext()
  })

  
  test('Sign In On TC-Studio', async () => {
    const tabStudio = await context.newPage()

    // Land on TC-Studio Site
    const loginPageCRT = new LoginPageCRT(tabStudio)
    await loginPageCRT.navigate(process.env.URL_CRT_LOGIN)
    await loginPageCRT.hasTitle(loginDataCRT.title)

    //Sign In
    const decryptedUsernameCRT = decryptData(process.env.ENCRYPTED_USERNAME_CRT,process.env.SECRET_KEY)
    const decryptedPasswordCRT = decryptData(process.env.ENCRYPTED_PASSWORD_CRT,process.env.SECRET_KEY)
    await loginPageCRT.enterUsername(decryptedUsernameCRT)
    await loginPageCRT.enterPassword(decryptedPasswordCRT)
    await loginPageCRT.clickOnLoginButton()

    //Verify DashboardText on Dashboard Page
    const dashboardPageCRT = new DashboardPageCRT(tabStudio)
    expect(await dashboardPageCRT.getDashboardText()).toEqual(dashboardDataCRT.dashboardText)
    await dashboardPageCRT.clickOnContentReviewLink()
    const contentReviewPageCRT = new ContentReviewPageCRT(tabStudio)
    await contentReviewPageCRT.doesNotHaveURL(process.env.URL_CRT_CONTENTREVIEW)
  })

  
  test.afterAll(async () => {
    await browser.close()
  })

})
import { test, expect, chromium } from '@playwright/test'
import { LoginPageCRT } from '../../pages/tc-studio/LoginPageCRT'
import { DashboardPageCRT } from '../../pages/tc-studio/DashboardPageCRT'
import { ContentReviewPageCRT } from '../../pages/tc-studio/ContentReviewPageCRT'
import loginDataCRT from '../../testdata/tc-studio/LoginDataCRT.json'
import dashboardDataCRT from '../../testdata/tc-studio/DashboardDataCRT.json'
import { decryptData } from '../../utilities/encrypt_decrypt_data'

test.describe('Review Audits Suite', () => {
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
    // const encryptedUserName = encryptData('test_us1@tunecore.com')
    // const encryptedPassword = encryptData('Test@123')
    // console.log(encryptedUserName)
    // console.log(encryptedPassword)
    // const encryptedUserName = "U2FsdGVkX18Zz4ciDFApOPxnaTfXhEvsaLVy4Hb7A/NtjkxJ+paV6i7y59xLWnqT"
    // const encryptedPassword = "U2FsdGVkX1+tqhl93MAbA22Gn+hmCwosW0kvPo7e6VI="
    // const decryptedUserName = decryptData(process.env.ENCRYPTED_USERNAME_CRT)
    // const decryptedPassword = decryptData(process.env.ENCRYPTED_PASSWORD_CRT)
    // console.log(decryptedUserName)
    // console.log(decryptedPassword)

    //Sign In
    const decryptedUserNameCRT = decryptData(process.env.ENCRYPTED_USERNAME_CRT)
    const decryptedPasswordCRT = decryptData(process.env.ENCRYPTED_PASSWORD_CRT)
    await loginPageCRT.pause()
    await loginPageCRT.enterUsername(decryptedUserNameCRT)
    await loginPageCRT.enterPassword(decryptedPasswordCRT)
    await loginPageCRT.clickOnLoginButton()

    //Verify DashboardText on Dashboard Page
    const dashboardPageCRT = new DashboardPageCRT(tabStudio)
    expect(await dashboardPageCRT.getDashboardText()).toEqual(dashboardDataCRT.dashboardText)
    await dashboardPageCRT.clickOnContentReviewLink()
    const contentReviewPageCRT = new ContentReviewPageCRT(tabStudio)
    await contentReviewPageCRT.hasURL(process.env.URL_CRT_CONTENTREVIEW)
  })

  
  test.afterAll(async () => {
    await browser.close()
  })

})
import { test, expect, chromium } from '@playwright/test'
import { LoginPageCRT } from '../../pages/tc-studio/LoginPageCRT'
import loginDataCRT from '../../testdata/tc-studio/LoginDataCRT.json'

test.describe.skip('Sign In Codegen Suite', () => {
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
    await loginPageCRT.pause()

  })


  test.afterAll(async () => {
    await browser.close()
  })
})
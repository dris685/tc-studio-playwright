import {expect} from '@playwright/test'
export class LoginPageWWW{

    constructor(page){
        this.page = page
        this.userEmailInputBox = page.locator('#person_email')
        this.passwordInputBox = page.locator('#person_password')
        this.loginButton = page.locator('#login-button')
    }

    async navigate(url){
        await this.page.goto(url)
    }

    async hasTitle(title){
        await expect(this.page).toHaveTitle(title)
    }

    async enterUserEmail(email){
        await this.userEmailInputBox.fill(email)
    }

    async enterPassword(password){
        await this.passwordInputBox.fill(password)
    }

    async clickOnLoginButton(){
        await this.loginButton.click()
    }

}
import {expect} from '@playwright/test'
export class LoginPageCRT{

    constructor(page){
        this.page = page
        this.usernameInputBox = page.locator('#email')
        this.passwordInputBox = page.locator('#password')
        this.loginButton = page.locator("button[type='submit']")
    }

    async navigate(url){
        await this.page.goto(url)
    }

    async pause(){
        await this.page.pause()
    }

    async hasTitle(title){
        await expect(this.page).toHaveTitle(title)
    }

    async enterUsername(username){
        await this.usernameInputBox.fill(username)
    }

    async enterPassword(password){
        await this.passwordInputBox.fill(password)
    }

    async clickOnLoginButton(){
        await this.loginButton.click()
    }

}
import {expect} from '@playwright/test'
export class AdminPageWWW{

    constructor(page){
        this.page = page
        this.accountNameText = page.locator('#admin-wrapper section dt a')
        this.accountEmailText = page.locator('.alpha.omega > div > dl > dd > a')
        this.accountStatusText = page.locator('.alpha.omega > div > dl > dd.user_status_active')
        this.vipTagText = page.locator('.alpha.omega > div > dl > dd:nth-child(4)')
        this.accountCreatedText = page.locator('.alpha.omega > div > dl > dd:nth-child(6) b')
        this.accountCountryText = page.locator('.alpha.omega > div > dl > dd:nth-child(13) b')
        this.countryWebsiteText = page.locator('.alpha.omega > div > dl > dd:nth-child(14) b')
    }

    async navigate(url){
        await this.page.goto(url)
    }

    async hasTitle(title){
        await expect(this.page).toHaveTitle(title)
    }

    async getAccountNameText(){
        expect(await this.accountNameText).toBeVisible()
        return await this.accountNameText.textContent()
    }

    async getAccountEmailText(){
        return await this.accountEmailText.textContent()
    }

    async getAccountStatusText(){
        return (await this.accountStatusText.textContent()).trim()
    }

    async getVipTagText(){
        return ((await this.vipTagText.textContent()).trim()).slice(0,3)
    }

    async getAccountCreatedText(){
        return await this.accountCreatedText.textContent()
    }

    async getAccountCountryText(){
        return await this.accountCountryText.textContent()
    }

    async getCountryWebsiteText(){
        return await this.countryWebsiteText.textContent()
    }
}
import { expect } from "@playwright/test"

export class DashboardPageCRT{

    constructor(page){
        this.page = page
        this.dashboardText = page.locator('p.tcstudio-MuiTypography-h5')
        this.contentReviewLink = page.getByRole('link', { name: 'Content Review', exact: true })
        
    }

    async getDashboardText(){
        return await this.dashboardText.textContent()
    }

    async navigate(url){
        await this.page.goto(url)
    }

    async clickOnContentReviewLink(){
        await this.contentReviewLink.click()
    }

    async hasTitle(title){
        await expect(this.page).toHaveTitle(title)
    }
    
}
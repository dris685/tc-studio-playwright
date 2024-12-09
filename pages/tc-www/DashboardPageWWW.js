export class DashboardPageWWW{

    constructor(page){
        this.page = page
        this.usernameText = page.locator('#admin-controls nav strong')
        this.dashboardText = page.locator('#admin-controls nav ul li').nth(0)
    }

    async getUsernameText(){
        return await this.usernameText.textContent();
    }

    async getDashboardText(){
        return await this.dashboardText.textContent()
    }

}
import {expect} from '@playwright/test'
export class ContentReviewPageCRT{

    constructor(page){
        this.page = page
        this.tunecoreLogo = page.getByAltText('TuneCore Logo')
        
        // Customer Account Section
        this.customerAccountText = page.locator('.tcstudio-jss65 span')
        this.accountNameText = page.locator('.tcstudio-jss72 .tcstudio-jss34 a')
        this.accountEmailText = page.locator('.tcstudio-jss73 .tcstudio-jss34')
        this.personIdText = page.locator('.tcstudio-jss66 .tcstudio-MuiGrid-container .tcstudio-MuiGrid-item:nth-child(2) p').nth(0)
        this.accountStatusText = page.locator('.tcstudio-jss66 .tcstudio-MuiGrid-container .tcstudio-MuiGrid-item:nth-child(2) p').nth(1)
        this.accountCreatedText = page.locator('.tcstudio-jss66 .tcstudio-MuiGrid-container .tcstudio-MuiGrid-item:nth-child(2) p').nth(2)
        this.accountCountryText = page.locator('.tcstudio-jss66 .tcstudio-MuiGrid-container .tcstudio-MuiGrid-item:nth-child(2) p').nth(3)
        this.countryWebsiteText = page.locator('.tcstudio-jss66 .tcstudio-MuiGrid-container .tcstudio-MuiGrid-item:nth-child(2) p').nth(4)
        this.siftScoreText = page.locator('div .tcstudio-jss71')
        this.siftScoreNumberText = page.locator('div .tcstudio-jss70')
        this.vipTagText = page.locator('.tcstudio-jss67 .tcstudio-MuiChip-label')

        // Album Level Section
        this.albumIDText = page.locator('.tcstudio-MuiGrid-container > .tcstudio-MuiGrid-container:nth-child(2) > div:nth-child(2) p')
        this.albumNameText = page.locator('.tcstudio-jss24 .tcstudio-MuiCardHeader-content a')
        this.artworkAttribute = page.locator('div.tcstudio-MuiCardMedia-root img')
        this.primaryArtistNameText = page.locator('.tcstudio-jss38 .tcstudio-MuiTypography-body2 span')
        this.UPCNumberText = page.locator('.tcstudio-jss32 > .tcstudio-MuiGrid-container > .tcstudio-MuiGrid-container:nth-child(2) > .tcstudio-MuiGrid-item:nth-child(4) .tcstudio-MuiTypography-body2')
        this.labelNameText = page.locator('.tcstudio-jss32 > .tcstudio-MuiGrid-container > .tcstudio-MuiGrid-container:nth-child(3) > .tcstudio-MuiGrid-item:nth-child(2) .tcstudio-MuiTypography-body2 span')
        this.albumCreatedText = page.locator('.tcstudio-jss51 > .tcstudio-MuiTypography-body2:nth-child(1)')
        this.albumReleasedText = page.locator('.tcstudio-jss51 > .tcstudio-MuiTypography-body2:nth-child(3)')
        this.releaseTypeText = page.locator('.tcstudio-jss52 > .tcstudio-MuiTypography-body2:nth-child(1)')
        this.primaryGenreText = page.locator('.tcstudio-jss52 > .tcstudio-MuiTypography-body2:nth-child(2)')
        this.secondaryGenreText = page.locator('.tcstudio-jss52 > .tcstudio-MuiTypography-body2:nth-child(4)')
        this.metadataLanguageText = page.locator('.tcstudio-jss53 > .tcstudio-MuiTypography-body2:nth-child(2)')
        

        // Review Audits Section
        this.reviewAuditsTitleText = page.locator('#tableTitle')
        this.albumReviewAuditsStatusText = page.locator('table.tcstudio-MuiTable-root tbody tr').nth(0).locator('p')
        this.albumReviewAuditsReviewerText = page.locator('table.tcstudio-MuiTable-root tbody tr').nth(0).locator('td').nth(1)
        this.albumReviewAuditsReviewedAtText = page.locator('table.tcstudio-MuiTable-root tbody tr').nth(0).locator('td').nth(2)

    }

    async navigate(url){
        await this.page.goto(url)
    }

    async hasTitle(title){
        await expect(this.page).toHaveTitle(title)
    }

    async hasURL(URL){
        expect(await this.tunecoreLogo).toBeVisible()
        await expect(this.page).toHaveURL(URL)
    }

    async doesNotHaveURL(URL){
        expect(await this.tunecoreLogo).toBeVisible()
        await expect(this.page).not.toHaveURL(URL)
    }

    // Customer Account Section
    async getCustomerAccountText(){
        return await this.customerAccountText.textContent()
    }
    
    async getAccountNameText(){
        return await this.accountNameText.textContent()
    }

    async getAccountEmailText(){
        return await this.accountEmailText.textContent()
    }

    async getPersonIdText(){
        return await this.personIdText.textContent()
    }

    async getAccountStatusText(){
        return await this.accountStatusText.textContent()
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

    async getSiftScoreText(){
        return (await this.siftScoreText.textContent()).slice((await this.siftScoreText.textContent()).indexOf('"')+1,(await this.siftScoreText.textContent()).lastIndexOf('"')-1)
    }

    async getSiftScoreNumberText(){
        return await this.siftScoreNumberText.textContent()
    }

    async getVipTagText(){
        return await this.vipTagText.textContent()
    }

    async clickOnAccountNameText(){
        await this.accountNameText.click()
    }

    // Album Level Section
    async getAlbumIDText(){
        return await this.albumIDText.textContent()
    }

    async getAlbumNameText(){
        return await this.albumNameText.textContent()
    }

    async clickOnAlbumNameText(){
        await this.albumNameText.click()
    }

    async getArtworkAttribute(){
        return await this.artworkAttribute.getAttribute('alt')
    }

    async getPrimaryArtistNameText(){
        return await this.primaryArtistNameText.textContent()
    }

    async getUPCNumberText(){
        return await this.UPCNumberText.textContent()
    }

    async getLabelNameText(){
        return await this.labelNameText.textContent()
    }

    async getAlbumCreatedText(){
        return await this.albumCreatedText.textContent()
    }

    async getAlbumReleasedText(){
        return (await this.albumReleasedText.textContent()).slice(0,10)
    }

    async getReleaseTypeText(){
        return await this.releaseTypeText.textContent()
    }

    async getPrimaryGenreText(){
        return await this.primaryGenreText.textContent()
    }

    async getSecondaryGenreText(){
        return await this.secondaryGenreText.textContent()
    }

    async getMetadataLanguageText(){
        return await this.metadataLanguageText.textContent()
    }

    // Review Audits Section
    async getReviewAuditsTitleText(){
        return await this.reviewAuditsTitleText.textContent()
    }

    async getAlbumReviewAuditsStatusText(){
        return await this.albumReviewAuditsStatusText.textContent()
    }

    async getAlbumReviewAuditsReviewerText(){
        return await this.albumReviewAuditsReviewerText.textContent()
    }

    async getAlbumReviewAuditsReviewedAtText(){
        return await this.albumReviewAuditsReviewedAtText.textContent()
    }
    

}
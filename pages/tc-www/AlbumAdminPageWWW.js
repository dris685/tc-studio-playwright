import {expect} from '@playwright/test'
export class AlbumAdminPageWWW{

    constructor(page){
        this.page = page

        // Album Level Section
        this.artworkAttribute = page.locator('.admin-album-img')
        this.albumNameText = page.locator('#admin-wrapper > h2')
        this.releaseTypeText = page.locator('#admin-wrapper > h2')
        this.primaryArtistNameText = page.locator('dd.artist > strong:nth-child(1)')
        this.labelNameText = page.locator('dd.artist > strong:nth-child(3)')
        this.albumIdText = page.locator('.alpha > .title-box:nth-child(6) h3')
        this.UPCNumberText = page.locator('#new_tc_upcX')
        this.albumCreatedText = page.locator('div .alpha > .title-box:nth-child(10) > dd:nth-child(2)')
        this.albumReleasedText = page.locator('span.edit_golive_date')
        this.primaryGenreText = page.locator('.alpha > div.title-box:nth-child(6) > dd:nth-child(14)')
        this.secondaryGenreText = page.locator('.alpha > div.title-box:nth-child(6) > dd:nth-child(15)')
        this.metadataLanguageText = page.locator('.alpha > div.title-box:nth-child(6) > dd:nth-child(12)')

        // Content Review Section
        this.reviewAuditsTitleText = page.locator('.alpha > div.title-box:nth-child(19) h3')
        this.albumReviewAuditsReviewedAtText = page.locator('.alpha > div.title-box:nth-child(19) > dd:nth-child(8)')
        this.albumReviewAuditsStatusText = page.locator('.alpha > div.title-box:nth-child(19) > dd:nth-child(8)')
        this.albumReviewAuditsReviewerText = page.locator('.alpha > div.title-box:nth-child(19) > dd:nth-child(8)')
    }

    async navigate(url){
        await this.page.goto(url)
    }

    async hasTitle(title){
        await expect(this.page).toHaveTitle(title)
    }

    // Album Level Section
    async getArtworkAttribute(){
        return await this.artworkAttribute.getAttribute('alt')
    }

    async getAlbumNameText(){
        return (await this.albumNameText.textContent()).slice((await this.albumNameText.textContent()).indexOf(':')+2)
    }

    async getReleaseTypeText(){
        return (await this.releaseTypeText.textContent()).slice(0, (await this.releaseTypeText.textContent()).indexOf(':'))
    }

    async getPrimaryArtistNameText(){
        return await this.primaryArtistNameText.textContent()
    }

    async getlabelNameText(){
        return await this.labelNameText.textContent()
    }

    async getAlbumIdText(){
        return (await this.albumIdText.textContent()).slice((await this.albumIdText.textContent()).indexOf(':')+3)
    }

    async getUPCNumberText(){
        return (await this.UPCNumberText.textContent()).slice(0,(await this.UPCNumberText.textContent()).length-1)
    }

    async getAlbumCreatedText(){
        return (await this.albumCreatedText.textContent()).slice((await this.albumCreatedText.textContent()).indexOf(':')+2)
    }

    async getAlbumReleasedText(){
        return (await this.albumReleasedText.textContent()).trim()
    }

    async getPrimaryGenreText(){
        return (await this.primaryGenreText.textContent()).slice((await this.primaryGenreText.textContent()).indexOf(':')+2,(await this.primaryGenreText.textContent()).indexOf(','))
    }

    async getSecondaryGenreText(){
        return (await this.secondaryGenreText.textContent()).slice((await this.secondaryGenreText.textContent()).indexOf(':')+2,(await this.secondaryGenreText.textContent()).indexOf(','))
    }

    async getMetadataLanguageText(){
        return (await this.metadataLanguageText.textContent()).slice((await this.metadataLanguageText.textContent()).indexOf(':')+2,(await this.metadataLanguageText.textContent()).indexOf('(')-1)
    }


    // Content Review Section
    async getReviewAuditsTitleText(){
        return await this.reviewAuditsTitleText.textContent()
    }

    async getAlbumReviewAuditsReviewedAtText(){
        return ((await this.albumReviewAuditsReviewedAtText.textContent()).trim()).slice(0,((await this.albumReviewAuditsReviewedAtText.textContent()).trim()).lastIndexOf(':'))
    }

    async getAlbumReviewAuditsStatusText(){
        return ((((await this.albumReviewAuditsStatusText.textContent()).split('\n')[2]).trim()).split(' ')[1]).toUpperCase()
    }

    async getAlbumReviewAuditsReviewerText(){
        return ((await this.albumReviewAuditsReviewerText.textContent()).split('\n')[3]).trim()
    }

}
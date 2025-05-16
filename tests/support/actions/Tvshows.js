const { expect } = require('@playwright/test')

export class TvShows {
    constructor(page) {
        this.page = page
    }

    async goTvShow() {
        await this.page.locator('a[href$="tvshows"]').click()
    }

    async goFormTvShow() {
        await this.page.locator('a[href$="register"]').click()
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Cadastrar' }).click()
    }

    async create(tvshow) {
        await this.goTvShow()
        await this.goFormTvShow()

        await this.page.getByLabel('Titulo da série').fill(tvshow.title)
        await this.page.getByLabel('Sinopse').fill(tvshow.overview)

        await this.page.locator('#select_company_id .react-select__indicator')
            .click()
        // Ver anotação 1
        await this.page.locator('.react-select__option')
            .filter({ hasText: tvshow.company })
            .click()

        await this.page.locator('#select_year .react-select__indicator')
            .click()
        await this.page.locator('.react-select__option')
            .filter({ hasText: tvshow.release_year })
            .click()

        await this.page.getByLabel('Temporadas').fill((tvshow.season).toString())

        await this.page.locator('input[name=cover]')
            .setInputFiles('tests/support/fixtures' + tvshow.cover)

        if (tvshow.featured) {
            await this.page.locator('.featured .react-switch').click()
        }
        await this.submit()
    }

    async alertHaveText(target) {
        await expect(this.page.locator('.alert')).toHaveText(target)
    }
}






// Apontamentos sobre a aula:
//
// ANOTAÇÃO 1 - Obtendo o HTML de um DropDow
// Após implementar a função de click no dropdonw, temos q criar uma constante que irá receber o conteúdo do dropdonw
// e depois imprimir o valor dessa constante no console. Após execução do teste o html do dropdonw será exibido na aba Console da interface de teste do Playwright,
// copiar o HTML e salvar em um arquivo .html temporário na raiz do projeto. Abrir o HTML e pesquisar por uma das opções do dropdonw (Ex: Netflix)
// Nesse trecho do html iremos montar o seletor do dropdonw e após finalizar deletar o .html temporário do projeto
// Ex de código:
//      const html = await this.page.content()
//      console.log(html)

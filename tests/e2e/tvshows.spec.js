const { test, expect } = require('../support/')

const data = require('../support/fixtures/tvshows.json')
const { executeSQL } = require('../support/database')

test.beforeAll(async () => {
    // Pré condição Geral: Garantir que a serie não esteja cadastrada no Banco de Dados
    // Implementado Script SQL para deletar a série no Banco de Dados antes de iniciar o cadastro - BeforeAll
    await executeSQL(`Delete from tvshows`)
})

test('Cadastro de uma nova Série de TV', async ({ page }) => {
    //Criando variável que receberá os dados da série
    const tvshow = data.create

    //Pré condição 1: Admin logado na aplicação
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    // Iniciando a função que irá criar uma serie de TV
    await page.tvShows.create(tvshow)
    await page.popup.haveText(`A série '${tvshow.title}' foi adicionada ao catálogo.`)
})

test('Não deve cadastrar quando os campos obrigatorios não são preenchidos', async ({ page }) => {
    //Pré condição: Admin logado na aplicação
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    //Acessar a página principal de Série de TV
    await page.tvShows.goTvShow()

    //Acessar a página de cadstro de Serie de TV
    await page.tvShows.goFormTvShow()

    //Cadastrar uma série de TV com campos não preenchidos
    await page.tvShows.submit()

    await page.tvShows.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório (apenas números)'
    ])
})

test('Não deve cadastrar Série de TV já cadastrada', async ({ page, request }) => {
    //Criando variável que receberá os dados da Série
    const tvshow = data.duplicate

    //Pré condição 1: Garantir que a série de TV esteja cadastrada no Banco de Dados
    //Fazer o cadastro da série pela API
    await request.api.postTvShow(tvshow)

    //Pré condição 2: Admin logado na aplicação
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    //Cadastrar série de TV pelo formulário
    await page.tvShows.create(tvshow)

    //Resultado esperado
    await page.popup.haveText(`A série '${tvshow.title}' foi adicionada ao catálogo.`)
})

test('Deletar uma série de TV', async ({ page, request }) => {
    //Criando variável que receberá os dados da série
    const tvshow = data.to_remove

    //Pré condição 1: Garantir que a série de TV esteja cadastrada no Banco de Dados
    //Fazer o cadastro da série pela API
    await request.api.postTvShow(tvshow)
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvShows.goTvShows()
    await page.tvShows.remove(tvshow)
    await page.popup.haveText('Série removida com sucesso.')

    //Pré condição 2: Admin logado na aplicação
    // await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
})


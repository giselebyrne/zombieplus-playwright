const { test, expect } = require('../support/')

const data = require('../support/fixtures/movies.json')

const { executeSQL } = require('../support/database')
test.beforeAll(async () => {
    await executeSQL(`Delete from movies`)
})

test('Deve cadastrar um novo Filme', async ({ page }) => {
    // Pré condição: Garantir que o filme não esteja cadastrado no Banco de Dados
    // Implementando Script SQL para deletar o filme no Banco de Dados antes de iniciar o cadastro
    const movie = data.create

    //Pré condição: Estar logado na aplicação
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.create(movie)
    await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`)
})

test('Deve poder remover um filme', async ({ page, request }) => {
    const movie = data.to_remove
    await request.api.postMovie(movie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    // xpath exemplo para exclusão de registro
    // td[text()="A Noite dos Mortos-Vivos"]/..//button
    // await page.click('.request-removal')

    // Exclusão de registro usando o método getByRole
    await page.movies.remove(movie.title)
    await page.popup.haveText('Filme removido com sucesso.')
})

test('Não deve cadastrar Filme já cadastrado', async ({ page, request }) => {
    // Pré condição: Gerar a massa do teste e deletar a massa da Base de dados (beforeAll)
    const movie = data.duplicate
    await request.api.postMovie(movie)

    //Pré condição: Estar logado na aplicação
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    //Ação
    await page.movies.create(movie)
    //Resultado esperado
    await page.popup.haveText(`O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('Não deve cadastrar quando os campos obrigatorios não são preenchidos', async ({ page }) => {
    //Pré condição: Estar logado na aplicação
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.goForm()
    await page.movies.submit()

    await page.movies.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório'
    ])
})

test('Deve realizar busca pelo termo Zumbi', async ({ page, request }) => {
    const movies = data.search

    movies.data.forEach(async (m) => {
        await request.api.postMovie(m)
    })
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    // Input é um termo para Busca
    await page.movies.search(movies.input)
    await page.movies.tableHave(movies.outputs)
})





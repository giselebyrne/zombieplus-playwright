const { test } = require('../support/')

const data = require('../support/fixtures/movies.json')

const {executeSQL} = require('../support/database')

test('Deve cadastrar um novo Filme', async ({ page}) => {
    // Pré condição: Garantir que o filme não esteja cadastrado no Banco de Dados
    // Implementando Script SQL para deletar o filme no Banco de Dados antes de iniciar o cadastro
    const movie = data.create
    await executeSQL(`Delete from movies where title = '${movie.title}';`)
    
    // // Pré condição: Estar logado na aplicação
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn()

    await page.movies.create(movie.title, movie.overview, movie.company, movie.release_year)

    await page.toast.containText('UhullCadastro realizado com sucesso!')
})

// test('Não deve cadastrar Filme já cadastrado', async ({ page }) => {
         
//     // Pré condição: Estar logado na aplicação
//     await loginPage.visit()
//     await loginPage.submit('admin@zombieplus.com', 'pwd123')
//     await moviesPage.isLoggedIn()

//     await moviesPage.create(movie.title, movie.overview, movie.company, movie.release_year)

//     await toast.containText('Cadastro realizado com sucesso!')
// })



const { test, expect } = require('../support/')


test('Deve logar como Administrador', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'pwd123')
    await page.login.isLoggedIn('Admin')
})

test('Não deve logar com Senha incorreta', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'abc123')

    const message = 'Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'
     await page.popup.haveText(message)
})

test('Não deve logar com Email incorret', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('adminzombiepluscom', 'abc123')

    await page.login.alertHaveText('Email incorreto')
})

test('Não deve logar quando o Email não é preenchido', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('', 'abc123')

    await page.login.alertHaveText('Campo obrigatório')
})

test('Não deve logar quando a senha não é preenchido', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', '')

    await page.login.alertHaveText('Campo obrigatório')
})

test('Não deve logar quando os campos não forem preenchidos', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('', '')

    await page.login.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
})


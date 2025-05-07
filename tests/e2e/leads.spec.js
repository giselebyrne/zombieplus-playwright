
// No JS uma classe é escrita no padrão PascalCase e funções/variaveis/constante é no padrão camelCase
// O beforeEach roda um vez para CADA test
// O beforeAll roda uma única vez para todos os test
const { test, expect } = require('../support')
const { faker } = require('@faker-js/faker')


test('Deve cadastrar um Lead na fila de espera', async ({ page }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm(leadName, leadEmail)

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'
  await page.toast.containText(message)
});

test('Não deve cadastrar quando o email já existe', async ({ page, request }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  const newLead = await request.post('http://localhost:3333/leads', {
    data:{
    name: leadName,
    email: leadEmail
  }
  })

  expect(newLead.ok()).toBeTruthy()

  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm(leadName, leadEmail)

  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
  await page.toast.containText(message)
});

test('Não deve cadastrar com email incorreto', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('Gisele Santos', 'giselesantyahoocom')

  await page.landing.alertHaveText('Email incorreto')

});

test('Não deve cadastrar quando o nome não é preenchido', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('', 'giselesant@yahoo.com')
 
  await page.landing.alertHaveText('Campo obrigatório')
});

test('Não deve cadastrar quando o email não é preenchido', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('Gisele Santos', '')
  await page.landing.alertHaveText('Campo obrigatório')
});

test('Não deve cadastrar quando nenhum campo é preenchido', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('','')

  await page.landing.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
});



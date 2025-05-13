
const { expect } = require('@playwright/test');

// Classe que contem os testes cases da Página Principal da aplicação
export class Leads {

    constructor(page){
        this.page = page
    }

    async visit() {
        await this.page.goto('http://localhost:3000');
    }

    async openLeadModal() {
        //Outra forma de encontrar elementos na página:
        await this.page.getByRole('button', { name: /Aperte o play/ }).click()
        // Check Point de Automação - Ao clicar em um botão verificar se o modal ou tela exibida está correta
        await expect(this.page.getByTestId('modal').getByRole('heading')).toHaveText('Fila de espera')
    }

    async submitLeadForm(name,email) {
        await this.page.getByPlaceholder('Informe seu nome').fill(name)
        await this.page.getByPlaceholder('Informe seu email').fill(email)

        await this.page.getByTestId('modal').getByText('Quero entrar na fila!').click()
    }

    async alertHaveText(target){
        await expect(this.page.locator('.alert')).toHaveText(target)
    }
}


//Anotações das aulas:

        //Comentários sobre a busca de elementos na página HTML do Curso
        //await page.click('//button[text()="Aperte o play... se tiver coragem"]');

        // getbyrole('tagHTML= Elemento do tipo button', 'texto) - é mais comum usar essa estrategia no playwright
        //await page.getByRole('button', {name: 'Aperte o play... se tiver coragem'}).click()

        // Busca de elemento usando locator pela propriedade id
        //await page.locator('#name').fill('gisele@yahoo.com')

        // Busca de elemento usando o locator pela propriedade name
        //await page.locator('input[name=name]').fill('giteles@outlook.com')

        // Busca de elemento usando o locator pela propriedade placeholder. Sempre que tiver propriedade que o valor tenha caracter especial ou espaços tem que usar uma aspas difente ,
        // no exemplo abaixo o locator foi iniciado com aspas simples, então tem usar aspas duplas para o 
        // o valor da propriedade
        //await page.locator('input[placeholder="Seu nome completo"]').fill('giteles@outlook.com')

        //Dica de como chegar no html do elemento suspenso de confirmação de cadastro de Leads
        // await page.getByText('seus dados conosco').click()
        // const content = await page.content()
        // console.log(content)
import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided!', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    // para objetos, arrays e funções, o toEqual compara o conteúdo, se usar o toBe, ele compara a referência
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })
})

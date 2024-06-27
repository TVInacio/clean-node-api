import { LoginController } from './login'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { EmailValidator } from '../../protocols/email-validator'
import { HttpRequest } from '../../protocols'
import { Authentication } from '../../../domain/usecases/authentication'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com.br',
    password: 'any_password'
  }
})

interface SutTypes {
  sut: LoginController
  makeEmailValidatorStub: EmailValidator
  makeAuthenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const makeEmailValidatorStub = makeEmailValidator()
  const makeAuthenticationStub = makeAuthentication()
  const sut = new LoginController(makeEmailValidatorStub, makeAuthenticationStub)
  return {
    sut,
    makeEmailValidatorStub,
    makeAuthenticationStub
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com.br'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, makeEmailValidatorStub } = makeSut()
    jest.spyOn(makeEmailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, makeEmailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(makeEmailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com.br')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, makeEmailValidatorStub } = makeSut()
    jest.spyOn(makeEmailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, makeAuthenticationStub } = makeSut()
    const authSpy = jest.spyOn(makeAuthenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com.br', 'any_password')
  })
})

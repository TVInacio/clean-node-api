import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSignUpController } from '../factories/signup'

export default (router: Router): void => {
  // isto vai retornar uma instância de controlador e ele vai adaptar o controlador para uma assinatura que o express entenda
  router.post('/signup', adaptRoute(makeSignUpController()))
}

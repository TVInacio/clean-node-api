import { Request, Response, NextFunction } from 'express'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-control-allow-origin', '*') // permitir que qualquer origem acesse nossa API
  res.set('access-control-allow-methods', '*') // permitir que qualquer método HTTP acesse nossa API
  res.set('access-control-allow-headers', '*') // permitir que qualquer cabeçalho acesse nossa API
  // executar isso no final de tudo, para que nossa requisição não fique presa aqui
  next()
}

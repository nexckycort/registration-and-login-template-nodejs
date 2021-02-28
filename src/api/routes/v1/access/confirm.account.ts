import { Router, Request, Response, NextFunction } from 'express'

import { SuccessResponse, BadRequestError } from 'helpers/api.response'
import validator, { ValidationSource } from 'api/middleware/validator'
import schema from './schema'
import UsersService from 'services/users/users.service'

const router = Router()

const validateAccount = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { hash } = req.params

  const account = await UsersService.validateAccountByHash(hash)
  if (typeof account === 'string') return BadRequestError(res, account)
  if (account) return BadRequestError(res, 'Account activated')

  next()
}

const confirmAccount = async (req: Request, res: Response): Promise<Response> => {
  const { hash } = req.params

  await UsersService.confirmAccount(hash)

  return SuccessResponse(res, 'Successful account activation')
}

router.get('/:hash', validator(schema.validateHash, ValidationSource.PARAM), validateAccount, confirmAccount)

export default router

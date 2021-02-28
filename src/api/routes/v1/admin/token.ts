import { Request, Response, Router } from 'express'

import { SuccessResponse } from 'helpers/api.response'
import Logger from 'helpers/logger'

const router = Router()

export default router.get('/', (req: Request, res: Response) => {
  Logger.info(req.body.session)
  SuccessResponse(res, 'valid token')
})

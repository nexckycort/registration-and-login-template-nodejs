import { Router } from 'express'

import signup from 'api/routes/v1/access/signup'
import confirmAccount from 'api/routes/v1/access/confirm.account'
import signin from 'api/routes/v1/access/signin'
// import auth from '../../middleware/auth'

const router = Router()

router.use('/signup', signup)
router.use('/confirm-account', confirmAccount)
router.use('/signin', signin)

export default router

import { Router } from 'express'

import access from './access'
import admin from './admin'
import auth from 'api/middleware/auth'

const router = Router({ caseSensitive: true })

router.use('/access', access)
router.use('/admin', auth, admin)

export default router

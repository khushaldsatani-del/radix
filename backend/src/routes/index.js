import { Router } from 'express'
import helloRoutes from './hello.routes.js'

const router = Router()

router.get('/health', (req, res) => res.json({ status: 'ok' }))
router.use('/hello', helloRoutes)

export default router

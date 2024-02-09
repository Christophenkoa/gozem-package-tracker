import { ResponseCode } from '../../utils'
import { HealthController } from '../../controllers'
import express from 'express'

export default class HealthRoutes {
    public router: express.Router

    constructor() {
        this.router = express.Router()
        this.registerRoutes()
    }

    protected registerRoutes(): void {
        this.router.get('/', async (_req, res, _next) => {
            try {
                res.send(await new HealthController().getHealth())
            } catch (e) {
                res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
                    error: 'unknown Error',
                })
            }
        })
    }
}

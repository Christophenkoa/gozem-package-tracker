import { ResponseCode } from '../../utils'
import { AuthController } from '../../controllers'
import express from 'express'

export default class AuthRoutes {
    public router: express.Router

    constructor() {
        this.router = express.Router()
        this.registerRoutes()
    }

    protected registerRoutes(): void {
        this.router.post('/login', async (req, res, _next) => {
            try {
                const userResponse = await new AuthController().login(req.body)

                if ('error' in userResponse) {
                    return res.status(userResponse.statusCode).send({
                        errorMessage: userResponse.error,
                    })
                }

                return res.send(userResponse)
            } catch (e) {
                res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
                    error: 'Unknown Error',
                })
            }
        })
    }
}

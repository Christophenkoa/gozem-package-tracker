import { ResponseCode } from '../../utils'
import { PackageController } from '../../controllers'
import express from 'express'
import { PackageType } from '../../types'
import { AppMiddlewares } from '../../middlewares'

export default class PackageRoutes {
    public router: express.Router

    adminAuthorization = new AppMiddlewares().authorizeUser('admin')

    constructor() {
        this.router = express.Router()
        this.registerRoutes()
    }

    protected registerRoutes(): void {
        this.router.get('/', async (req, res, _next) => {
            try {
                const packageResponse =
                    await new PackageController().getPackages()

                return res.send(packageResponse)
            } catch (e) {
                res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
                    error: 'Unknown Error',
                })
            }
        })

        this.router.get('/:id', async (req, res, _next) => {
            try {
                const packageResponse =
                    await new PackageController().getPackage(req.params.id)

                if ('error' in packageResponse) {
                    return res.status(packageResponse.statusCode).send({
                        errorMessage: packageResponse.error,
                    })
                }

                return res.send(packageResponse)
            } catch (e) {
                res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
                    error: 'Unknown Error',
                })
            }
        })

        this.router.post(
            '/',
            this.adminAuthorization,
            async (req, res, _next) => {
                try {
                    const data: PackageType = req.body
                    const packageResponse =
                        await new PackageController().createPackage(data)

                    if ('error' in packageResponse) {
                        return res.status(packageResponse.statusCode).send({
                            errorMessage: packageResponse.error,
                        })
                    }

                    return res.send(packageResponse)
                } catch (e) {
                    res.status(
                        ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR
                    ).send({
                        error: 'Unknown Error',
                    })
                }
            }
        )

        this.router.put(
            '/:id',
            this.adminAuthorization,
            async (req, res, _next) => {
                const data: PackageType = req.body
                try {
                    const packageResponse =
                        await new PackageController().updatePackage(
                            data,
                            req.params.id
                        )

                    if ('error' in packageResponse) {
                        return res.status(packageResponse.statusCode).send({
                            errorMessage: packageResponse.error,
                        })
                    }

                    return res.send(packageResponse)
                } catch (e) {
                    res.status(
                        ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR
                    ).send({
                        error: 'Unknown Error',
                    })
                }
            }
        )

        this.router.delete(
            '/:id',
            this.adminAuthorization,
            async (req, res, _next) => {
                try {
                    const packageResponse =
                        await new PackageController().deletePackage(
                            req.params.id
                        )

                    if ('error' in packageResponse) {
                        return res.status(packageResponse.statusCode).send({
                            errorMessage: packageResponse.error,
                        })
                    }

                    return res.send(packageResponse)
                } catch (e) {
                    res.status(
                        ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR
                    ).send({
                        error: 'Unknown Error',
                    })
                }
            }
        )
    }
}

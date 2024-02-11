import { ResponseCode } from '../../utils'
import { DeliveryController } from '../../controllers'
import express from 'express'
import { DeliveryType } from '../../types'

export default class DeliveryRoutes {
    public router: express.Router

    constructor() {
        this.router = express.Router()
        this.registerRoutes()
    }

    protected registerRoutes(): void {
        this.router.get('/', async (req, res, _next) => {
            try {
                const deliveryResponse =
                    await new DeliveryController().getDeliveries()

                return res.send(deliveryResponse)
            } catch (e) {
                res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
                    error: 'Unknown Error',
                })
            }
        })

        this.router.get('/:id', async (req, res, _next) => {
            try {
                const deliveryResponse =
                    await new DeliveryController().getDelivery(req.params.id)

                if ('error' in deliveryResponse) {
                    return res.status(deliveryResponse.statusCode).send({
                        errorMessage: deliveryResponse.error,
                    })
                }

                return res.send(deliveryResponse)
            } catch (e) {
                res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
                    error: 'Unknown Error',
                })
            }
        })

        this.router.post('/', async (req, res, _next) => {
            try {
                const data: DeliveryType = req.body
                const deliveryResponse =
                    await new DeliveryController().createDelivery(data)

                if ('error' in deliveryResponse) {
                    return res.status(deliveryResponse.statusCode).send({
                        errorMessage: deliveryResponse.error,
                    })
                }

                return res.send(deliveryResponse)
            } catch (e) {
                res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
                    error: 'Unknown Error',
                })
            }
        })

        this.router.put('/:id', async (req, res, _next) => {
            const data: DeliveryType = req.body
            try {
                const deliveryResponse =
                    await new DeliveryController().updateDelivery(
                        data,
                        req.params.id
                    )

                if ('error' in deliveryResponse) {
                    return res.status(deliveryResponse.statusCode).send({
                        errorMessage: deliveryResponse.error,
                    })
                }

                return res.send(deliveryResponse)
            } catch (e) {
                res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
                    error: 'Unknown Error',
                })
            }
        })

        this.router.delete('/:id', async (req, res, _next) => {
            try {
                const deliveryResponse =
                    await new DeliveryController().deleteDelivery(req.params.id)

                if ('error' in deliveryResponse) {
                    return res.status(deliveryResponse.statusCode).send({
                        errorMessage: deliveryResponse.error,
                    })
                }

                return res.send(deliveryResponse)
            } catch (e) {
                res.status(ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR).send({
                    error: 'Unknown Error',
                })
            }
        })
    }
}

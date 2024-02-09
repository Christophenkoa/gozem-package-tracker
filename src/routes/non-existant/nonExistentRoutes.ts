import express from 'express'
import { ResponseCode } from '../../utils'

/**
 * !!! IMPORTANT !!!
 *
 * Always use this router after your last route definition with ...Router.use("*", NonExistantRoutes).
 * Never after the last route definition!
 * Otherwise, it overwrites all subsequent defined routes, hence they become inaccessible!
 */

export default class NonExistentRoutes {
    public router: express.Router

    constructor() {
        this.router = express.Router()
        this.registerRoutes()
    }
    public registerRoutes() {
        this.router.post('*', async (request, response) => {
            response.status(ResponseCode.HTTP_404_NOT_FOUND).send({
                error: `This route with ${request.method} method does not exist. conflicted by: ${request.baseUrl}`,
            })
        })

        this.router.get('*', async (request, response) => {
            response.status(ResponseCode.HTTP_404_NOT_FOUND).send({
                error: `This route with ${request.method} method does not exist. conflicted by: ${request.baseUrl}`,
            })
        })

        this.router.delete('*', async (request, response) => {
            response.status(ResponseCode.HTTP_404_NOT_FOUND).send({
                error: `This route with ${request.method} method does not exist. conflicted by: ${request.baseUrl}`,
            })
        })

        this.router.put('*', async (request, response) => {
            response.status(ResponseCode.HTTP_404_NOT_FOUND).send({
                error: `This route with ${request.method} method does not exist. conflicted by: ${request.baseUrl}`,
            })
        })
    }
}

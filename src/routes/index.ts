import express from 'express'
import { HealthRoutes } from './health'
import { APPCONFIGS } from '../configs'
import { NonExistentRoutes } from './non-existant'
import { AuthRoutes } from './auth'
import { AppMiddlewares } from '../middlewares'

const routes = (server: express.Application): void => {
    server.use(`${APPCONFIGS.BASE_PATH}/health`, new HealthRoutes().router)
    server.use(`${APPCONFIGS.BASE_PATH}/auth`, new AuthRoutes().router)

    // ===================================================================================================
    // WARNING: Don't add further route definitions below this line! (see NonExistantRoutes definition)
    // ===================================================================================================
    server.use('*', new NonExistentRoutes().router)
}

export default routes

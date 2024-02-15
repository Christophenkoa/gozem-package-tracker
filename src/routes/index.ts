import express from 'express'
import { HealthRoutes } from './health'
import { APPCONFIGS } from '../configs'
import { NonExistentRoutes } from './non-existant'
import { AuthRoutes } from './auth'
import { PackageRoutes } from './package'
import { DeliveryRoutes } from './delivery'
import { AppMiddlewares } from '../middlewares'

const authMiddleware = new AppMiddlewares().verifyLoggedInUser

const routes = (server: express.Application): void => {
    server.use(`${APPCONFIGS.BASE_PATH}/health`, new HealthRoutes().router)
    server.use(`${APPCONFIGS.BASE_PATH}/auth`, new AuthRoutes().router)
    server.use(
        `${APPCONFIGS.BASE_PATH}/package`,
        authMiddleware,
        new PackageRoutes().router
    )
    server.use(
        `${APPCONFIGS.BASE_PATH}/delivery`,
        authMiddleware,
        new DeliveryRoutes().router
    )

    // ===================================================================================================
    // WARNING: Don't add further route definitions below this line! (see NonExistantRoutes definition)
    // ===================================================================================================
    server.use('*', new NonExistentRoutes().router)
}

export default routes

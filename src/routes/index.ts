import express from 'express'
import { HealthRoutes } from './health'
import { APPCONFIGS } from '../configs'
import { NonExistentRoutes } from './non-existant'

const routes = (server: express.Application): void => {
    server.use(`${APPCONFIGS.BASE_PATH}/health`, new HealthRoutes().router)

    // ===================================================================================================
    // WARNING: Don't add further route definitions below this line! (see NonExistantRoutes definition)
    // ===================================================================================================
    server.use('*', new NonExistentRoutes().router)
}

export default routes

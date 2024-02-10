import * as dotenv from 'dotenv'

dotenv.config()

const APPCONFIGS = {
    PORT: 8000,
    BASE_PATH: '/api',
    MONGO: {
        URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
        DB_NAME: process.env.MONGO_DB_NAME || 'gozem_app',
    },
    BASE_URL: process.env.BASE_URL || '',
    JWT: {
        EXPIRATION: 60 * 60 * 24 * 7,
        COOKIE_EXPIRATION: 360,
        SECRET: 'thesecret',
    },
}

export default APPCONFIGS

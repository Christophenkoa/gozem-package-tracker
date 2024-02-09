import express from 'express'
import { APPCONFIGS } from './configs'
import routes from './routes'

const cors = require('cors')

class Server {
    public app: express.Application

    constructor() {
        this.app = express()

        this.app.use(
            cors({
                origin: '*',
                methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
            })
        )
        this.config()
    }

    public config(): void {
        this.app.set('port', APPCONFIGS.PORT)
        this.app.use(express.json())
        this.app.use(express.static('public'))

        routes(this.app)
    }

    public start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server listening in port', APPCONFIGS.PORT)
        })
    }
}

const server = new Server()
server.start()

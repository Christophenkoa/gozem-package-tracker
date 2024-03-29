import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { APPCONFIGS } from './configs'
import routes from './routes'
import Mongo from './mongo'
import Bootstrap from './bootstrap'
import { socket } from './socket'

const cors = require('cors')

class Server {
    public app: express.Application

    constructor() {
        this.app = express()

        this.app.use(
            cors({
                origin: APPCONFIGS.BASE_URL,
                methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
            })
        )
        this.config()
    }

    public config(): void {
        this.app.set('port', APPCONFIGS.PORT)
        this.app.use(express.json())
        this.app.use(express.static('public'))

        this.app.use(
            '/docs',
            swaggerUi.serve,
            swaggerUi.setup(undefined, {
                swaggerOptions: {
                    url: '/swagger.json',
                },
            })
        )

        routes(this.app)
    }

    public connectMongoDb(): void {
        const mongo = new Mongo()
        mongo
            .connect()
            .then(() => {
                console.log('MongoDB Connection Established')

                // Bootstrap data.
                new Bootstrap().start()
            })
            .catch((err) => console.log('MongoDB not Connected', err))
    }

    public start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server listening in port', APPCONFIGS.PORT)
            this.connectMongoDb()
            socket.connect()
        })
    }
}

const server = new Server()
server.start()

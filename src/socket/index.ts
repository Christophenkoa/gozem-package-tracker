import { Socket } from 'socket.io'
import { Connection } from './connection'

class MySocket {
    private _io = require('socket.io')(3000, {
        cors: {
            origin: ['http://localhost:4200'],
        },
    })

    public async connect() {
        this._io.on('connection', (socket) => {
            console.log(socket.id)
            this.locationChanged(socket)
            this.statusChanged(socket)
        })

        console.log('=========== web socket connection is ready ===========')
    }

    public async locationChanged(socket: Socket) {
        socket.on(
            Connection.location_changed,
            (payload: {
                event: string
                delivery_id: string
                location: any
            }) => {
                console.log(payload)
                //TODO: update the location.
                const delivery = undefined
                this.deliveryUpdated(socket, delivery)
            }
        )
    }

    public async statusChanged(socket: Socket) {
        socket.on(
            Connection.status_changed,
            (payload: { event; delivery_id; status }) => {
                //TODO: update the delivery's status.
                const delivery = undefined
                this.deliveryUpdated(socket, delivery)
            }
        )
    }

    public async deliveryUpdated(
        socket: Socket,
        payload: { event: string; delivery_object }
    ) {
        socket.broadcast.emit(Connection.delivery_updated, payload)
    }
}

export const socket = new MySocket()

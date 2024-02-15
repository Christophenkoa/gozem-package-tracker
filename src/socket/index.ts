import { Socket } from 'socket.io'
import { Connection } from './connection'
import { DeliveryService } from '../services'
import { DeliveryStatus, DeliveryType, LocationType } from '../types'
import { APPCONFIGS } from '../configs'

class MySocket {
    private _io = require('socket.io')(APPCONFIGS.SOCKET.PORT, {
        cors: {
            origin: [APPCONFIGS.BASE_URL],
        },
    })

    public async connect() {
        this._io.on('connection', (socket: Socket) => {
            console.log(socket.id)
            this.locationChanged(socket)
            this.statusChanged(socket)
        })

        console.log('=========== web socket connection is ready ===========')
    }

    public async locationChanged(socket: Socket) {
        socket.on(
            Connection.location_changed,
            async (payload: {
                event: string
                delivery_id: string
                location: LocationType
            }) => {
                const deliveryService = new DeliveryService()
                let delivery: DeliveryType
                const result = await deliveryService.getDeliveryByID(
                    payload.delivery_id
                )
                if ('error' in result) {
                    console.log(result.error)
                } else {
                    delivery = result.data
                    delivery.location = payload.location

                    if (delivery.location != payload.location) {
                        const updatedDelivery =
                            await deliveryService.updateDelivery(
                                delivery,
                                payload.delivery_id
                            )

                        if ('error' in updatedDelivery) {
                            console.log(updatedDelivery.error)
                        }
                    }
                }
                this.deliveryUpdated({
                    event: Connection.delivery_updated,
                    delivery_object: delivery,
                })
            }
        )
    }

    public async statusChanged(socket: Socket) {
        socket.on(
            Connection.status_changed,
            async (payload: {
                event: string
                delivery_id: string
                status: DeliveryStatus
            }) => {
                const deliveryService = new DeliveryService()
                let driverDelivery: DeliveryType
                const result = await deliveryService.getDeliveryByID(
                    payload.delivery_id
                )
                if ('error' in result) {
                    console.log(result.error)
                } else {
                    driverDelivery = result.data

                    if (payload.status !== driverDelivery.status) {
                        const updatedDelivery =
                            await deliveryService.updateDeliveryStatus(
                                payload.status,
                                driverDelivery,
                                payload.delivery_id
                            )

                        if (!updatedDelivery) {
                            return
                        }
                    } else {
                        return
                    }
                }
                this.deliveryUpdated({
                    event: Connection.delivery_updated,
                    delivery_object: driverDelivery,
                })
            }
        )
    }

    public async deliveryUpdated(payload: {
        event: string
        delivery_object: DeliveryType
    }) {
        console.log(payload)
        this._io.sockets.emit(Connection.delivery_updated, payload)
    }
}

export const socket = new MySocket()

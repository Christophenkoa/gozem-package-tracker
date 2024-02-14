import { Socket } from 'socket.io'
import { Connection } from './connection'
import { DeliveryService } from '../services'
import { DeliveryStatus, DeliveryType, LocationType } from '../types'

class MySocket {
    private _io = require('socket.io')(3000, {
        cors: {
            origin: ['http://localhost:4200'],
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
                const deliveryService = new DeliveryService();
                let delivery: DeliveryType;
                const result = await deliveryService.getDeliveryByID(payload.delivery_id);
                if("error" in result) {
                    console.log(result.error)
                } else {
                    delivery = result.data;
                    delivery.location = payload.location;

                    if(delivery.location != payload.location) {
                        const updatedDelivery = await deliveryService
                        .updateDelivery(delivery, payload.delivery_id);
                    
                        if("error" in updatedDelivery) {
                            console.log(updatedDelivery.error);
                        }
                    }
                }
                this.deliveryUpdated(socket, {
                    event: Connection.delivery_updated,
                    delivery_object: delivery
                });
            }
        )
    }

    public async statusChanged(socket: Socket) {
        socket.on(
            Connection.status_changed,
            async (payload: { event: string; delivery_id: string; status: DeliveryStatus }) => {
                const deliveryService = new DeliveryService();
                let driverDelivery: DeliveryType;
                const result = await deliveryService.getDeliveryByID(payload.delivery_id);
                if("error" in result) {
                    console.log(result.error)
                } else {
                    driverDelivery = result.data;

                    if(payload.status !== driverDelivery.status) {

                        //TODO: Check if the status change is allowed.
                        driverDelivery.status = payload.status;

                        const updatedDelivery = await deliveryService
                            .updateDelivery(driverDelivery, payload.delivery_id);
                        
                        if("error" in updatedDelivery) {
                            console.log(updatedDelivery.error);
                        }
                    }
                }
                this.deliveryUpdated(socket, {
                    event: Connection.delivery_updated,
                    delivery_object: driverDelivery
                });

                this.deliveryUpdated(socket, {
                    event: Connection.delivery_updated,
                    delivery_object: driverDelivery
                })
            }
        )
    }

    public async deliveryUpdated(
        socket: Socket,
        payload: { event: string; delivery_object: DeliveryType }
    ) {
        socket.emit(Connection.delivery_updated, payload)
    }
}

export const socket = new MySocket()

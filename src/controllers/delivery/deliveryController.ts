import { Body, Delete, Example, Get, Path, Post, Put, Route, Tags } from 'tsoa'
import { DeliveryStatus, DeliveryType } from '../../types'
import { DeliveryService } from '../../services'

@Route('api/delivery')
@Tags('Delivery Controller Operations')
export default class DeliveryController {
    @Example<{ data: DeliveryType[] }>({
        data: [
            {
                package_id: '4edd40c86762e0fb12000003',
                pickup_time: new Date('2021-03-25'),
                start_time: new Date('2021-03-25'),
                end_time: new Date('2021-03-26'),
                location: { lng: 0.000001, lat: 0.983 },
                status: DeliveryStatus.in_transit,
            },
        ],
    })
    @Get('/')
    public async getDeliveries(): Promise<{ data: DeliveryType[] }> {
        return new DeliveryService().getDeliveries()
    }

    @Example<{ data: DeliveryType }>({
        data: {
            package_id: '4edd40c86762e0fb12000003',
            pickup_time: new Date('2021-03-25'),
            start_time: new Date('2021-03-25'),
            end_time: new Date('2021-03-26'),
            location: { lng: 0.000001, lat: 0.983 },
            status: DeliveryStatus.in_transit,
        },
    })
    @Get('{deliveryId}')
    public async getDelivery(
        @Path() deliveryId: string
    ): Promise<{ data: DeliveryType } | { statusCode: number; error: string }> {
        return new DeliveryService().getDeliveryByID(deliveryId)
    }

    @Example<{ data: DeliveryType }>({
        data: {
            package_id: '4edd40c86762e0fb12000003',
            pickup_time: new Date('2021-03-25'),
            start_time: new Date('2021-03-25'),
            end_time: new Date('2021-03-26'),
            location: { lng: 0.000001, lat: 0.983 },
            status: DeliveryStatus.in_transit,
        },
    })
    @Post('/')
    public async createDelivery(
        @Body() data: DeliveryType
    ): Promise<{ data: DeliveryType } | { statusCode: number; error: string }> {
        return new DeliveryService().addDelivery(data)
    }

    @Example<{ data: DeliveryType }>({
        data: {
            package_id: '4edd40c86762e0fb12000003',
            pickup_time: new Date('2021-03-25'),
            start_time: new Date('2021-03-25'),
            end_time: new Date('2021-03-26'),
            location: { lng: 0.000001, lat: 0.983 },
            status: DeliveryStatus.in_transit,
        },
    })
    @Put('{deliveryId}')
    public async updateDelivery(
        @Body() data: DeliveryType,
        @Path() deliveryId: string
    ): Promise<{ data: DeliveryType } | { statusCode: number; error: string }> {
        return new DeliveryService().updateDelivery(data, deliveryId)
    }

    @Example<{ data: DeliveryType }>({
        data: {
            package_id: '4edd40c86762e0fb12000003',
            pickup_time: new Date('2021-03-25'),
            start_time: new Date('2021-03-25'),
            end_time: new Date('2021-03-26'),
            location: { lng: 0.000001, lat: 0.983 },
            status: DeliveryStatus.in_transit,
        },
    })
    @Delete('{deliveryId}')
    public async deleteDelivery(
        @Path() deliveryId: string
    ): Promise<{ data: DeliveryType } | { statusCode: number; error: string }> {
        return new DeliveryService().deleteDelivery(deliveryId)
    }
}

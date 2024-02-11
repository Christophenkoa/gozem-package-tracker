import { Delivery } from '../../models'
import Mongo from '../../mongo'
import { DeliveryType } from '../../types'
import { ResponseCode } from '../../utils'

export default class DeliveryService {
    private _mongoDeliveryService: Mongo<DeliveryType>

    public constructor() {
        this._mongoDeliveryService = new Mongo()
    }

    public async getDeliveries(): Promise<{ data: DeliveryType[] | [] }> {
        const deliveries = await this._mongoDeliveryService.getAll(Delivery)
        return {
            data: deliveries,
        }
    }

    public async getDeliveryByID(
        id: string
    ): Promise<{ data: DeliveryType } | { statusCode: number; error: string }> {
        if (!id) {
            return {
                error: "delivery's id is required.",
                statusCode: ResponseCode.HTTP_404_NOT_FOUND,
            }
        }

        const deliveryResult: DeliveryType | undefined =
            await this._mongoDeliveryService.getById(id, Delivery)

        if (!deliveryResult) {
            return {
                error: `delivery with id ${id} is not found`,
                statusCode: ResponseCode.HTTP_404_NOT_FOUND,
            }
        }
        return { data: deliveryResult }
    }

    public async addDelivery(
        data: DeliveryType
    ): Promise<{ data: DeliveryType } | { statusCode: number; error: string }> {
        const deliveryResult = await this._mongoDeliveryService.add(
            data,
            Delivery
        )

        if ('error' in deliveryResult) {
            console.log(deliveryResult)

            return {
                error: `Fail to add delivery`,
                statusCode: ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR,
            }
        }

        return {
            data: deliveryResult,
        }
    }

    public async updateDelivery(
        data: DeliveryType,
        deliveryId: string
    ): Promise<{ data: DeliveryType } | { statusCode: number; error: string }> {
        if (!deliveryId) {
            return {
                error: "delivery's id is required.",
                statusCode: ResponseCode.HTTP_404_NOT_FOUND,
            }
        }

        const updatedDelivery = await this._mongoDeliveryService.updateByID(
            data,
            Delivery,
            deliveryId
        )

        if ('error' in updatedDelivery) {
            console.log(updatedDelivery)

            return {
                error: 'Fail to update delivery',
                statusCode: ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR,
            }
        }

        return {
            data: updatedDelivery,
        }
    }

    public async deleteDelivery(
        deliveryId: string
    ): Promise<{ data: DeliveryType } | { statusCode: number; error: string }> {
        if (!deliveryId) {
            return {
                error: "delivery's id is required.",
                statusCode: ResponseCode.HTTP_404_NOT_FOUND,
            }
        }

        const existingDelivery = await this._mongoDeliveryService.getById(
            deliveryId,
            Delivery
        )

        if (!existingDelivery) {
            return {
                error: 'This delivery does not exist',
                statusCode: ResponseCode.HTTP_404_NOT_FOUND,
            }
        }

        const deletedDelivery = await this._mongoDeliveryService.deleteById(
            deliveryId,
            Delivery
        )

        if ('error' in deletedDelivery) {
            console.log(deletedDelivery)

            return {
                error: 'Fail to delete delivery',
                statusCode: ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR,
            }
        }

        return {
            data: deletedDelivery,
        }
    }
}

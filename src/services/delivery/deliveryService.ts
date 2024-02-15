import { Delivery } from '../../models'
import Mongo from '../../mongo'
import { DeliveryStatus, DeliveryType } from '../../types'
import { ResponseCode } from '../../utils'
import { PackageService } from '../package'

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

        const packageId = data.package_id;

        if(data.package_id) {
            const packageService = new PackageService();
            const packageResult = await packageService.getPackageByID(packageId);

            if ('error' in packageResult) {
                console.log(packageResult)
    
                return {
                    error: `Fail to get package with id ${packageId}`,
                    statusCode: ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR,
                }
            }

            const linkedPackage = packageResult.data;
            linkedPackage.active_delivery_id = deliveryResult._id.toString();

            const updatedPackage = await packageService.updatePackage(linkedPackage, packageId);

            if ('error' in updatedPackage) {
                console.log(updatedPackage)
    
                return {
                    error: `Fail to update the associate package of delivery with id ${deliveryResult._id} `,
                    statusCode: ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR,
                }
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

    async updateDeliveryStatus(
        newStatus: DeliveryStatus,
        delivery: DeliveryType,
        deliveryId: string
    ) {
        const currentStatus = delivery.status
        const deliveryService = new DeliveryService()
        if (this.isValidStatusToUpdate(currentStatus, newStatus)) {
            delivery.status = newStatus
            if (newStatus === DeliveryStatus.pick_up) {
                delivery.pickup_time = new Date()
            } else if (
                newStatus === DeliveryStatus.failed ||
                newStatus === DeliveryStatus.delivered
            ) {
                delivery.end_time = new Date()
            }

            const updatedDelivery = await deliveryService.updateDelivery(
                delivery,
                deliveryId
            )

            if (!('error' in updatedDelivery)) {
                return delivery
            }

            console.log(updatedDelivery.error)
        }
    }

    isValidStatusToUpdate(
        oldStatus: DeliveryStatus,
        newStatus: DeliveryStatus
    ): boolean {
        switch (oldStatus) {
            case DeliveryStatus.open:
                return newStatus === DeliveryStatus.pick_up
            case DeliveryStatus.pick_up:
                return (
                    newStatus === DeliveryStatus.in_transit ||
                    newStatus === DeliveryStatus.failed
                )
            case DeliveryStatus.in_transit:
                return (
                    newStatus === DeliveryStatus.delivered ||
                    newStatus === DeliveryStatus.failed
                )
            default:
                return false
        }
    }
}

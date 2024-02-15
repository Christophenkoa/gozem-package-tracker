import { DeliveryStatus } from '../../../types';
import DeliveryService from '../deliveryService'

describe('Test Delivery service', () => {
    const deliveryService = new DeliveryService();

    it(' `isValidStatusToUpdate` should succeed to return the `true`', async () => {
        const newStatus = DeliveryStatus.pick_up;
        const oldStatus = DeliveryStatus.open; 
        expect((deliveryService.isValidStatusToUpdate(oldStatus, newStatus)))
            .toBe(true)
    })

    it('`isValidStatusToUpdate` should succeed to return the `false`', async () => {
        const newStatus = DeliveryStatus.failed;
        const oldStatus = DeliveryStatus.open; 
        expect((deliveryService.isValidStatusToUpdate(oldStatus, newStatus)))
            .toBe(false)
    })

    it(' `isValidStatusToUpdate` should succeed to return the `true`', async () => {
        const newStatus = DeliveryStatus.failed;
        const oldStatus = DeliveryStatus.pick_up; 
        expect((deliveryService.isValidStatusToUpdate(oldStatus, newStatus)))
            .toBe(true)
    })
})

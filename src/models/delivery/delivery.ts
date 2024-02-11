import mongoose from 'mongoose'
import { DeliveryStatus, DeliveryType } from '../../types'
const Schema = mongoose.Schema

const deliverySchema = new Schema<DeliveryType>({
    package_id: {
        type: String,
        ref: 'Package',
    },
    pickup_time: {
        type: Date,
    },
    start_time: {
        type: Date,
    },
    end_time: {
        type: Date,
    },
    location: {
        type: Map,
        of: String,
    },
    status: {
        type: String,
        enum: DeliveryStatus,
    },
})

deliverySchema.set('toJSON', {
    virtuals: true,
})

export const Delivery = mongoose.model<DeliveryType>('Delivery', deliverySchema)

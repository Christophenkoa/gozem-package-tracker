import mongoose from 'mongoose'
import {
    DeliveryStatus,
    DeliveryType,
    PackageType,
    UserType,
} from '../../types'
const Schema = mongoose.Schema

const deliverySchema = new Schema<DeliveryType>({
    package_id: {
        type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
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

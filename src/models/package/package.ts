import mongoose from 'mongoose'
import { PackageType } from '../../types'
const Schema = mongoose.Schema

const packageSchema = new Schema<PackageType>({
    active_delivery_id: {
        type: String,
        ref: 'Delivery',
    },
    description: {
        type: String,
    },
    weight: {
        type: Number,
    },
    width: {
        type: Number,
    },
    height: {
        type: Number,
    },
    depth: {
        type: Number,
    },
    from_name: {
        type: String,
    },
    from_address: {
        type: String,
    },
    from_location: {
        type: Map,
        of: String,
    },
    to_name: {
        type: String,
    },
    to_address: {
        type: String,
    },
    to_location: {
        type: Map,
        of: String,
    },
})

packageSchema.set('toJSON', {
    virtuals: true,
})

export const Package = mongoose.model<PackageType>('Package', packageSchema)

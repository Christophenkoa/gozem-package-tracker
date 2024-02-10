import mongoose from 'mongoose'
import { LocationType } from '../../types'
const Schema = mongoose.Schema

const locationSchema = new Schema<LocationType>({
    lat: {
        type: Number,
    },
    lng: {
        type: Number,
    },
})

locationSchema.set('toJSON', {
    virtuals: true,
})

export const Location = mongoose.model<LocationType>('User', locationSchema)

import mongoose from 'mongoose'
import { RoleType } from '../../types'

const Schema = mongoose.Schema

const roleSchema = new Schema<RoleType>({
    name: {
        type: String,
        enum: ['customer', 'driver', 'admin'],
    },
    description: {
        type: String,
    },
})

roleSchema.set('toJSON', {
    virtuals: true,
})

export const Role = mongoose.model<RoleType>('Role', roleSchema)

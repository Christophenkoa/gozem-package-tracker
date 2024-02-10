import mongoose from 'mongoose'
import { UserType } from '../../types'
const Schema = mongoose.Schema

const userSchema = new Schema<UserType>({
    avatarUrl: {
        type: String,
    },
    email: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    },
})

userSchema.set('toJSON', {
    virtuals: true,
})

export const User = mongoose.model<UserType>('User', userSchema)

import { Types } from 'mongoose'

export default interface UserType {
    _id?: Types.ObjectId
    avatarUrl?: string
    email?: string
    firstName?: string
    lastName?: string
    password?: string
    role?: Types.ObjectId
}

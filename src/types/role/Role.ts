import { Types } from 'mongoose'

export default interface RoleType {
    _id?: Types.ObjectId
    description?: string
    name: string
}

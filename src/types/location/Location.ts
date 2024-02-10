import { Types } from 'mongoose'

export default interface LocationType {
    _id?: Types.ObjectId
    lat?: number
    lng: number
}

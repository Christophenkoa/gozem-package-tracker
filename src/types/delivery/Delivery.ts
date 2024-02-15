import { Types } from 'mongoose'
import { LocationType } from '../location'
import { DeliveryStatus } from './DeliveryStatus'

export default interface DeliveryType {
    _id?: Types.ObjectId
    package_id?: string
    pickup_time: Date
    start_time: Date
    end_time: Date
    location: LocationType
    status: DeliveryStatus
}

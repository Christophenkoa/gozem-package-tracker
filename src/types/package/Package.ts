import { Types } from 'mongoose'
import { LocationType } from '../location'

export default interface PackageType {
    _id?: Types.ObjectId
    active_delivery_id?: Types.ObjectId
    description: string
    weight: number
    width: number
    height: number
    depth: number
    from_name: string
    from_address: string
    from_location: LocationType
    to_name: string
    to_address: string
    to_location: LocationType
}

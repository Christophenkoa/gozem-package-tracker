import { Schema } from 'mongoose'
import { CustomUser } from '../../models'
import Mongo from '../../mongo'
import { UserType } from '../../types'

export default class UserService {
    private _mongoUserService: Mongo<UserType>

    public constructor() {
        this._mongoUserService = new Mongo()
    }

    public async getUsers(): Promise<UserType[] | []> {
        return await this._mongoUserService.getAll(CustomUser)
    }

    public async getUserByEmail(email: string): Promise<UserType | undefined> {
        const user: UserType | undefined = await this._mongoUserService.getOne(
            { email: email },
            CustomUser,
            ['role']
        )
        return user
    }

    public async getUserByID(
        id: Schema.Types.ObjectId
    ): Promise<UserType | undefined> {
        const user: UserType | undefined = await this._mongoUserService.getById(
            id,
            CustomUser
        )
        return user
    }

    public async updateUser(
        email: string,
        data: UserType
    ): Promise<UserType | undefined> {
        if (!email) {
            return
        }
        const result = await this._mongoUserService.updateByUniqueProp(
            { email: email },
            data,
            CustomUser
        )

        if ('error' in result) {
            return
        }

        return result
    }

    // It is only used to bootstrapp the data.
    public async addUser(user: UserType) {
        const existingUser = await this.getUserByEmail(user.email)

        if (existingUser) {
            console.log('this user already exists.')
            return undefined
        }

        const newUser = await this._mongoUserService.add(user, CustomUser)

        if ('error' in newUser) {
            return undefined
        }

        return newUser
    }
}

import { Schema } from 'mongoose'
import { Role } from '../../models'
import Mongo from '../../mongo'
import { RoleType } from '../../types'

export default class RoleService {
    private _mongoRoleService: Mongo<RoleType>

    public constructor() {
        this._mongoRoleService = new Mongo()
    }

    public async getRoles(): Promise<RoleType[] | []> {
        return await this._mongoRoleService.getAll(Role)
    }

    public async getRoleByName(name: string): Promise<RoleType | undefined> {
        const role: RoleType | undefined = await this._mongoRoleService.getOne(
            { name: name },
            Role
        )
        return role
    }

    public async getRoleByID(
        id: Schema.Types.ObjectId
    ): Promise<RoleType | undefined> {
        const role: RoleType | undefined = await this._mongoRoleService.getById(
            id,
            Role
        )
        return role
    }

    public async addRole(role: RoleType) {
        const existingRole = await this.getRoleByName(role.name)

        if (existingRole) {
            console.log('this role already exist')
            return undefined
        }

        const newRole = await this._mongoRoleService.add(role, Role)

        if ('error' in newRole) {
            return undefined
        }

        return newRole
    }
}

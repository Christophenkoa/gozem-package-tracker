import { RoleService } from '../../services'
import { RoleType } from '../../types'

const users: RoleType[] = [
    {
        name: 'admin',
        description: "This is the admin user's role",
    },
    {
        name: 'driver',
        description: "This is the driver user's role",
    },
    {
        name: 'customer',
        description: "This is the customer user's role",
    },
]

export class RoleBootstrap {
    public async init() {
        const roleService = new RoleService()
        const existingRoles = await roleService.getRoles()

        if (existingRoles.length === 0) {
            users.forEach(async (role) => {
                await roleService.addRole(role)
            })

            console.log('roles bootstrapped')
        }
    }
}

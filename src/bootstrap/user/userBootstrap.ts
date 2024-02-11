import { RoleService, UserService } from '../../services'
import { RoleType, UserType } from '../../types'

const users: UserType[] = [
    {
        firstName: 'Tamo',
        lastName: 'Junior',
        email: 'admin@gmail.com',
        password:
            '$2a$12$iaBpgvFpWr33/tpjrPP86uGjMbI3XZR6ui0uQrZlqzAxcKhrLzHF.', //password
    },
    {
        firstName: 'Ngono',
        lastName: 'Albert',
        email: 'driver@gmail.com',
        password:
            '$2a$12$iaBpgvFpWr33/tpjrPP86uGjMbI3XZR6ui0uQrZlqzAxcKhrLzHF.', //password
    },
    {
        firstName: 'Abdoul',
        lastName: 'Salam',
        email: 'customer@gmail.com',
        password:
            '$2a$12$iaBpgvFpWr33/tpjrPP86uGjMbI3XZR6ui0uQrZlqzAxcKhrLzHF.', //password
    },
]

export class UserBootstrap {
    public async init() {
        const userService = new UserService()
        const existingUsers = await userService.getUsers()

        const userRoles = await new RoleService().getRoles()
        let adminRole: RoleType, customerRole: RoleType, driverRole: RoleType

        if (existingUsers.length === 0) {
            users.forEach(async (user) => {
                adminRole = userRoles.find((role) => role.name === 'admin')
                customerRole = userRoles.find(
                    (role) => role.name === 'customer'
                )
                driverRole = userRoles.find((role) => role.name === 'driver')

                if (user.email.includes('admin')) {
                    user.role = adminRole?._id.toHexString()
                } else if (user.email.includes('driver')) {
                    user.role = driverRole?._id.toHexString()
                } else if (user.email.includes('customer')) {
                    user.role = customerRole?._id.toHexString()
                }

                await userService.addUser(user)
            })

            console.log('users bootstrapped')
        }
    }
}

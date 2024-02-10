import { RoleService, UserService } from '../../services'
import { UserType } from '../../types'

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
        let roleIndex = 0

        if (existingUsers.length === 0) {
            users.forEach(async (user) => {
                const adminRole = userRoles.find(
                    (role) => role.name === 'admin'
                )
                const customerRole = userRoles.find(
                    (role) => role.name === 'customer'
                )
                const driverRole = userRoles.find(
                    (role) => role.name === 'driver'
                )

                if (user.email.includes('admin')) {
                    user.role = adminRole._id
                } else if (user.email.includes('driver')) {
                    user.role = driverRole._id
                } else if (user.email.includes('customer')) {
                    user.role = customerRole._id
                }

                await userService.addUser(user)
            })

            console.log('users bootstrapped')
        }
    }
}

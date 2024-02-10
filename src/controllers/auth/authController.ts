import { Body, Example, Post, Route, Tags } from 'tsoa'
import { UserType } from '../../types'
import { AuthService } from '../../services'
import { APPCONFIGS } from '../../configs'

@Route('api/auth')
@Tags('Authentication Controller Operations')
export default class AuthController {
    /**
     * Authentication Controller.
     */
    @Example<{ user: UserType; token: string }>({
        user: {
            email: 'admin@gmail.com',
            firstName: 'Tamo',
            lastName: 'Junior',
            password:
                '$2a$12$iaBpgvFpWr33/tpjrPP86uGjMbI3XZR6ui0uQrZlqzAxcKhrLzHF.',
        },
        token: 'eyJNzU2OTk0MCwiZXhwIjoxNzA4MTc0NzQwfQ.FpFr5',
    })
    @Post('/login')
    public async login(
        @Body() data: { email: string; password: string }
    ): Promise<
        | { user: UserType; token: string }
        | { error: string; statusCode: number }
    > {
        return new AuthService().login(data)
    }
}

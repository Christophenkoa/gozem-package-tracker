import { APPCONFIGS } from '../../configs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserService } from '../user'
import { ResponseCode } from '../../utils'

export default class AuthService {
    private _userService: UserService

    public constructor() {
        this._userService = new UserService()
    }

    private createAuthToken(payload: { email: string }) {
        const token = jwt.sign(payload, APPCONFIGS.JWT.SECRET, {
            expiresIn: APPCONFIGS.JWT.EXPIRATION,
        })

        return token
    }

    public decodeToken(bearerToken: string) {
        return jwt.verify(bearerToken, APPCONFIGS.JWT.SECRET)
    }

    private async hashPassword(password) {
        const salt = await bcrypt.genSalt(12)
        return await bcrypt.hash(password, salt)
    }

    public async login(data: {
        email: string
        password: string
    }): Promise<any> {
        if (!data?.email || !data.password) {
            return {
                error: 'email and password are required',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            }
        }

        const user = await this._userService.getUserByEmail(data.email)
        if (!user) {
            return {
                error: 'There is no account in our system with this email',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            }
        }

        const equal = await bcrypt.compare(
            String(data.password),
            user?.password
        )
        if (!equal) {
            return {
                error: 'Incorrect email and password combination',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            }
        }
        const token = this.createAuthToken({ email: user.email })
        return {
            user: user,
            token: token,
        }
    }
}

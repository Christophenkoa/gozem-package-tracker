import { NextFunction, Request, Response } from 'express'
import { AuthService, UserService } from '../services'
import { ResponseCode } from '../utils'

export default class AppMiddlewares {
    /**
     * Verify the user token and gets the authenticated user's email from header (only continue if valid Login)
     *
     * @param {Request} request
     * @param {Response} response
     * @param {NextFunction} next
     */
    public async verifyLoggedInUser(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        if (!request.headers.authorization) {
            response.status(401).send({ error: 'Unauthorized, token missing' })
        } else {
            const bearerToken =
                request.headers.authorization.split('Bearer ')[1]
            try {
                const result = new AuthService().decodeToken(bearerToken)
                console.log(result)
                response.locals.email = result['email']
                next()
            } catch (err) {
                console.log(err)
                response
                    .status(401)
                    .send({ error: `rejected token: ${bearerToken}` })
            }
        }
    }

    authorizeUser =
        (requiredRole: string) =>
        async (
            request: Request,
            response: Response,
            next: NextFunction
        ): Promise<void> => {
            if (!request.headers.authorization) {
                response
                    .status(ResponseCode.HTTP_401_UNAUTHORIZED)
                    .send({ errorMessgae: 'Unauthorized, token missing' })
            } else {
                const bearerToken =
                    request.headers.authorization.split('Bearer ')[1]
                try {
                    const result = new AuthService().decodeToken(bearerToken)
                    const email = result['email']
                    const user = await new UserService().getUserByEmail(email)
                    console.log(`----------------------${user}`)
                    if (user && user?.role['name'] === requiredRole) {
                        next()
                        return
                    }

                    response.status(ResponseCode.HTTP_403_FORBIDDEN).send({
                        errorMessage:
                            'Sorry you do not have access to this ressource',
                    })
                } catch (err) {
                    console.log(err)
                    response.status(ResponseCode.HTTP_403_FORBIDDEN).send({
                        errorMessage:
                            'Sorry you do not have access to this ressource',
                    })
                }
            }
        }
}

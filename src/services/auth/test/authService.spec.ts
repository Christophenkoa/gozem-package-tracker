import AuthService from '../authService'

describe('Test Authentification service', () => {
    const authService = new AuthService();
    const test_token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTcwODAyNzI0NywiZXhwIjoxNzA4NjMyMDQ3fQ.ul6TjE6lg-95gQPwou_VciX5Tawbl39lVxCDhCBAzqU"
    const email: string = "admin@gmail.com";

    it(' `createAuthToken` should succeed to return the `true`', async () => {
        expect((authService.decodeToken(test_token)?.email))
            .toBe(email)
    })
})

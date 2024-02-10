import { RoleBootstrap } from './role'
import { UserBootstrap } from './user'

export default class Bootstrap {
    public async start() {
        // Bootstraps roles.
        await new RoleBootstrap().init()
        // Bootstraps users.
        await new UserBootstrap().init()
    }
}

import { Health } from '../../types'

export default class HealthService {
    public async getHealth(): Promise<Health> {
        return {
            message: 'pong',
        }
    }
}

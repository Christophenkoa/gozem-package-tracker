import { Schema } from 'mongoose'
import { Package } from '../../models'
import Mongo from '../../mongo'
import { PackageType } from '../../types'
import { ResponseCode } from '../../utils'

export default class PackageService {
    private _mongoPackageService: Mongo<PackageType>

    public constructor() {
        this._mongoPackageService = new Mongo()
    }

    public async getPackages(): Promise<{ data: PackageType[] | [] }> {
        const packages = await this._mongoPackageService.getAll(Package)

        return {
            data: packages,
        }
    }

    public async getPackageByID(
        id: Schema.Types.ObjectId
    ): Promise<{ data: PackageType } | { statusCode: number; error: string }> {
        if (!id) {
            return {
                error: "package's id is required.",
                statusCode: ResponseCode.HTTP_404_NOT_FOUND,
            }
        }

        const packageResult: PackageType | undefined =
            await this._mongoPackageService.getById(id, Package)

        if (!packageResult) {
            return {
                error: `package with id ${id} is not found`,
                statusCode: ResponseCode.HTTP_404_NOT_FOUND,
            }
        }

        return {
            data: packageResult,
        }
    }

    public async addPackage(
        data: PackageType
    ): Promise<{ data: PackageType } | { statusCode: number; error: string }> {
        const packageResult = await this._mongoPackageService.add(data, Package)

        if ('error' in packageResult) {
            console.log(packageResult)

            return {
                error: `Fail to add package`,
                statusCode: ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR,
            }
        }

        return {
            data: packageResult,
        }
    }

    public async updatePackage(
        data: PackageType,
        packageId: Schema.Types.ObjectId
    ) {
        if (!packageId) {
            return {
                error: "package's id is required.",
                statusCode: ResponseCode.HTTP_404_NOT_FOUND,
            }
        }

        const updatedPackage = await this._mongoPackageService.updateByID(
            data,
            Package,
            packageId
        )

        if ('error' in updatedPackage) {
            console.log(updatedPackage)

            return {
                error: 'Fail to update package',
                statusCode: ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR,
            }
        }

        return {
            data: updatedPackage,
        }
    }

    public async deletePackage(packageId: Schema.Types.ObjectId) {
        if (!packageId) {
            return {
                error: "package's id is required.",
                statusCode: ResponseCode.HTTP_404_NOT_FOUND,
            }
        }

        const deletedPackage = await this._mongoPackageService.deleteById(
            packageId,
            Package
        )

        if ('error' in deletedPackage) {
            console.log(deletedPackage)

            return {
                error: 'Fail to delete package',
                statusCode: ResponseCode.HTTP_500_INTERNAL_SERVER_ERROR,
            }
        }

        return {
            data: deletedPackage,
        }
    }
}

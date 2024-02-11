import { Body, Delete, Example, Get, Path, Post, Put, Route, Tags } from 'tsoa'
import { PackageType } from '../../types'
import { PackageService } from '../../services'

@Route('api/package')
@Tags('Package Controller Operations')
export default class PackageController {
    @Example<{ data: PackageType[] }>({
        data: [
            {
                active_delivery_id: '4edd40c86762e0fb12000003',
                depth: 12,
                description: "package's description",
                height: 0.1,
                to_address: 'Kribi',
                to_name: 'Jimmy',
                weight: 12,
                width: 2,
                from_name: 'Chris',
                from_address: 'Bonaberi',
                from_location: { lng: 0.000001, lat: 0.983 },
                to_location: { lng: 1.2, lat: 0.23 },
            },
        ],
    })
    @Get('/')
    public async getPackages(): Promise<{ data: PackageType[] }> {
        return new PackageService().getPackages()
    }

    @Example<{ data: PackageType }>({
        data: {
            active_delivery_id: '4edd40c86762e0fb12000003',
            depth: 12,
            description: "package's description",
            height: 0.1,
            to_address: 'Kribi',
            to_name: 'Jimmy',
            weight: 12,
            width: 2,
            from_name: 'Chris',
            from_address: 'Bonaberi',
            from_location: { lng: 0.000001, lat: 0.983 },
            to_location: { lng: 1.2, lat: 0.23 },
        },
    })
    @Get('{packageId}')
    public async getPackage(
        @Path() packageId: string
    ): Promise<{ data: PackageType } | { statusCode: number; error: string }> {
        return new PackageService().getPackageByID(packageId)
    }

    @Example<{ data: PackageType }>({
        data: {
            active_delivery_id: '4edd40c86762e0fb12000003',
            depth: 12,
            description: "package's description",
            height: 0.1,
            to_address: 'Kribi',
            to_name: 'Jimmy',
            weight: 12,
            width: 2,
            from_name: 'Chris',
            from_address: 'Bonaberi',
            from_location: { lng: 0.000001, lat: 0.983 },
            to_location: { lng: 1.2, lat: 0.23 },
        },
    })
    @Post('/')
    public async createPackage(
        @Body() data: PackageType
    ): Promise<{ data: PackageType } | { statusCode: number; error: string }> {
        return new PackageService().addPackage(data)
    }

    @Example<{ data: PackageType }>({
        data: {
            active_delivery_id: '4edd40c86762e0fb12000003',
            depth: 12,
            description: "package's description",
            height: 0.1,
            to_address: 'Kribi',
            to_name: 'Jimmy',
            weight: 12,
            width: 2,
            from_name: 'Chris',
            from_address: 'Bonaberi',
            from_location: { lng: 0.000001, lat: 0.983 },
            to_location: { lng: 1.2, lat: 0.23 },
        },
    })
    @Put('{packageId}')
    public async updatePackage(
        @Body() data: PackageType,
        @Path() packageId: string
    ): Promise<{ data: PackageType } | { statusCode: number; error: string }> {
        return new PackageService().updatePackage(data, packageId)
    }

    @Example<{ data: PackageType }>({
        data: {
            active_delivery_id: '4edd40c86762e0fb12000003',
            depth: 12,
            description: "package's description",
            height: 0.1,
            to_address: 'Kribi',
            to_name: 'Jimmy',
            weight: 12,
            width: 2,
            from_name: 'Chris',
            from_address: 'Bonaberi',
            from_location: { lng: 0.000001, lat: 0.983 },
            to_location: { lng: 1.2, lat: 0.23 },
        },
    })
    @Delete('{packageId}')
    public async deletePackage(
        @Path() packageId: string
    ): Promise<{ data: PackageType } | { statusCode: number; error: string }> {
        return new PackageService().deletePackage(packageId)
    }
}

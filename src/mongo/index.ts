import { APPCONFIGS } from '../configs'
import mongoose, { FilterQuery, Model, Schema, UpdateQuery } from 'mongoose'
import { MongoErrors } from './utils/errors'

// create a class that contains all mongodb operations including
// This is an abstraction for mongo db Crud operations
export default class Mongo<M> {
    private uri: string
    private dbName: string

    constructor(
        uri: string = APPCONFIGS.MONGO.URL,
        dbName: string = APPCONFIGS.MONGO.DB_NAME
    ) {
        this.uri = uri
        this.dbName = dbName
    }

    public async connect(): Promise<void> {
        // const connection =
        // 	this.uri + "/" + this.dbName + "?authSource=admin";
        const connection = this.uri + '/' + this.dbName

        try {
            await mongoose.connect(connection)
            console.log('=========== MongoDB connection is ready ===========')
        } catch (error) {
            console.log('=========== Mongo DB connection Error ===========')
            console.log(MongoErrors.CONNECTION, error)
        }
    }

    public async add(
        element: M | undefined,
        Model: Model<M>
    ): Promise<M | { error: string }> {
        if (!element) {
            return {
                error: 'The element you are trying to add is undefined, please check and try again',
            }
        }

        try {
            const newElement = new Model(element)
            const savedElement = (await newElement.save()) as M
            return savedElement
        } catch (error) {
            console.log(error)
            return {
                error: MongoErrors.ADD,
            }
        }
    }

    public async addMultiple(
        elements: M[] | undefined,
        Model: Model<M>
    ): Promise<Array<M | { error: string }>> {
        if (!elements) {
            return [
                {
                    error: 'The elements list you are trying to add is undefined',
                },
            ]
        }
        if (elements.length === 0) {
            return [
                {
                    error: 'The elements list you are trying to add is of length 0',
                },
            ]
        }

        const returnList: Array<M | { error: string }> = []
        for (const element of elements) {
            try {
                const newElement = new Model(element)
                const savedElement = (await newElement.save()) as M
                returnList.push(savedElement)
            } catch (error) {
                console.log('addMultiple ERROR', error)
                returnList.push({
                    error: MongoErrors.ADD,
                })
            }
        }

        console.log('addMultiple RETURN LIST', returnList)
        return returnList
    }

    public async upsert(
        element: M | undefined,
        Model: Model<M>
    ): Promise<M | { error: string }> {
        if (!element) {
            return {
                error: 'The element you are trying to add is undefined, please check and try again',
            }
        }
        try {
            const query: FilterQuery<M> = {}

            for (const [key, value] of Object.entries(
                element as Record<string, any>
            )) {
                query[key as keyof M] = value as any
            }

            const existingElement = await Model.findOne(query)

            if (existingElement) {
                // Update the existing element
                const updatedElement = await Model.findByIdAndUpdate(
                    existingElement._id,
                    element as UpdateQuery<M>,
                    { new: true }
                )
                if (updatedElement) {
                    return updatedElement
                } else {
                    return {
                        error: MongoErrors.UPDATE,
                    }
                }
            } else {
                // Add a new element
                const newElement = new Model(element)
                const savedElement = (await newElement.save()) as M
                return savedElement
            }
        } catch (error) {
            console.log('upsert ERROR', error)
            return { error: MongoErrors.UPDATE }
        }
    }

    public async upsertMultiple(
        elements: M[] | undefined,
        Model: Model<M>
    ): Promise<Array<M | { error: string }>> {
        if (!elements) {
            return [
                {
                    error: 'The elements list you are trying to add is undefined',
                },
            ]
        }
        const returnList: Array<M | { error: string }> = []

        for (const element of elements) {
            try {
                const upsertedElement = await this.upsert(element, Model)
                if (upsertedElement) {
                    returnList.push(upsertedElement)
                } else {
                    returnList.push({
                        error: MongoErrors.UPDATE,
                    })
                }
            } catch (error) {
                console.log('upsertMultiple', error)
                returnList.push({
                    error: MongoErrors.UPDATE,
                })
            }
        }

        console.log('upsertMultiple RETURN LIST', returnList)
        return returnList
    }

    public async updateByID(
        element: M,
        Model: Model<M>,
        elementID: Schema.Types.ObjectId
    ): Promise<M | { error: string }> {
        try {
            const updatedElement = await Model.findByIdAndUpdate(
                elementID,
                element as UpdateQuery<M>,
                { new: true }
            )
            if (updatedElement) {
                return updatedElement
            }
            throw new Error(`Element with ID ${elementID} not found.`)
        } catch (error) {
            console.log(error)
            return {
                error: MongoErrors.UPDATE,
            }
        }
    }

    public async updateByUniqueProp(
        filter: FilterQuery<M>,
        element: M,
        Model: Model<M>
    ): Promise<M | { error: string }> {
        try {
            const updatedElement = await Model.findOneAndUpdate(
                filter,
                element as UpdateQuery<M>,
                { new: true }
            )
            if (updatedElement) {
                return updatedElement
            }
            throw new Error(`Element with prop ${filter} not found.`)
        } catch (error) {
            console.log(error)
            return {
                error: MongoErrors.UPDATE,
            }
        }
    }

    public async getAll(
        Model: Model<M>,
        populateFields?: string[] | any
    ): Promise<M[]> {
        try {
            if (populateFields) {
                const allElements: M[] =
                    await Model.find().populate(populateFields)

                return allElements
            } else {
                const allElements: M[] = await Model.find()
                return allElements
            }
        } catch (error) {
            console.log(error)
            return []
        }
    }

    public async getById(
        elementID: Schema.Types.ObjectId,
        Model: Model<M>
    ): Promise<M | undefined> {
        try {
            const element = await Model.findById(elementID)
            return element
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    public async getOne(
        filter: FilterQuery<M>,
        Model: Model<M>,
        populateFields?: string[] | any
    ): Promise<M | undefined> {
        try {
            let query: any

            if (populateFields) {
                query = Model.findOne(filter).populate(populateFields)
            } else {
                query = Model.findOne(filter)
            }

            const element: M | undefined = await query.exec()
            return element
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    public async deleteById(
        elementID: Schema.Types.ObjectId,
        Model: Model<M>
    ): Promise<M | undefined> {
        try {
            const deletedElement = await Model.findByIdAndDelete(elementID)
            return deletedElement
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    public async deleteAllContent(): Promise<boolean> {
        try {
            // Get the list of all registered models
            const models = mongoose.modelNames()

            for (const modelName of models) {
                // Get the Model for each collection and delete all documents
                const Model = mongoose.model<M>(modelName)
                await Model.deleteMany({})
                console.log(
                    `All documents in collection "${modelName}" deleted.`
                )
            }

            console.log('All content in the database deleted successfully.')
            return true
        } catch (error) {
            console.log('Error deleting all content:', error)
            return false
        }
    }
}

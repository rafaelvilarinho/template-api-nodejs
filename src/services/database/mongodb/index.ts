import { MongoClient, ObjectId } from 'mongodb'
import { environment } from '../../../config/environment'
import logger from '../../../utils/logger'

export type IndexType = ObjectId

const mongoDbUri = environment.MONGODB_URI
const mongoDbClient = new MongoClient(mongoDbUri)

export async function findAll<T>(collection: string, query: Record<string, unknown>, options?: Record<string, unknown>): Promise<T[]> {
  try {
    await mongoDbClient.connect()

    const cursor = await mongoDbClient
      .db(environment.MONGODB_DATABASE)
      .collection(collection)
      .find<T>(query, options)

    const data = await cursor.toArray()

    return data
  } catch (error) {
    logger.error('', error)
  } finally {
    mongoDbClient.close()
  }

  return []
}

export async function findOne<T>(collection: string, query: Record<string, unknown>, options?: Record<string, unknown>): Promise<T | null> {
  try {
    await mongoDbClient.connect()

    const data = await mongoDbClient
      .db(environment.MONGODB_DATABASE)
      .collection(collection)
      .findOne<T>(query, options)

    return data
  } catch (error) {
    logger.error('', error)
  } finally {
    mongoDbClient.close()
  }

  return null
}

export async function insert(collection: string, document: Record<string, unknown>, options?: Record<string, unknown>): Promise<string | null> {
  try {
    await mongoDbClient.connect()

    const data = await mongoDbClient
      .db(environment.MONGODB_DATABASE)
      .collection(collection)
      .insertOne(document)

    return data.insertedId.toString()
  } catch (error) {
    logger.error('', error)
  } finally {
    mongoDbClient.close()
  }

  return null
}

export async function update(
  collection: string, 
  filter: Record<string, unknown>, 
  document: Record<string, unknown>, 
  options?: Record<string, unknown>
): Promise<boolean> {
  try {
    await mongoDbClient.connect()

    const data = await mongoDbClient
      .db(environment.MONGODB_DATABASE)
      .collection(collection)
      .updateOne(filter, document)

    return data.modifiedCount > 0
  } catch (error) {
    logger.error('', error)
  } finally {
    mongoDbClient.close()
  }

  return false
}

export async function remove(
  collection: string, 
  filter: Record<string, unknown>,
  options?: Record<string, unknown>
): Promise<boolean> {
  try {
    await mongoDbClient.connect()

    const data = await mongoDbClient
      .db(environment.MONGODB_DATABASE)
      .collection(collection)
      .deleteOne(filter)

    return data.deletedCount > 0
  } catch (error) {
    logger.error('', error)
  } finally {
    mongoDbClient.close()
  }

  return false
}
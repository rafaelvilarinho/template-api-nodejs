import { ObjectId } from 'mongodb'
import { insertOne, removeOne, select, selectAll, selectById, updateOne } from '../../services/database'
import logger from '../../utils/logger'
import { UserDTO, UserType } from './users.types'

const DATASOURCE = "users"

export async function list (): Promise<UserDTO[]> {
  try {
    const response = await selectAll<UserDTO>(DATASOURCE, {})

    return response
  } catch (error) {
    logger.error('Error getting all users', error)
  } 

  return []
}

export async function read (data: {id: string}): Promise<UserDTO | null> {
  try {
    const response = await selectById<UserDTO>(DATASOURCE, data.id)

    return response
  } catch (error) {
    logger.error('Error getting user by id', error)
  }

  return null
}

export async function readByEmail (data: {email: string}): Promise<UserDTO | null> {
  try {
    const response = await select<UserDTO>(DATASOURCE, data)

    return response
  } catch (error) {
    logger.error('Error getting user by id', error)
  }

  return null
}

export async function store (data: {
  name: string,
  email: string,
  password: string,
  type: UserType,
}): Promise<string | null> {
  try {
    const response = await insertOne(DATASOURCE, {
      name: data.name,
      email: data.email,
      password: data.password,
      type: data.type,
      createdAt: new Date(),
      active: 1
    })

    return response
  } catch (error) {
    logger.error('Error creating user', error)
  }

  return null
}

export async function update (data: {
  id: string,
  name: string,
}): Promise<boolean> {
  try {
    const response = await updateOne(DATASOURCE, {_id: new ObjectId(data.id)}, {
      name: data.name,
      updatedAt: new Date()
    })

    return response
  } catch (error) {
    logger.error('Error updating user', error)
  }

  return false
}

export async function updateType (data: {
  id: string,
  type: UserType
}): Promise<boolean> {
  try {
    const response = await updateOne(DATASOURCE, {_id: new ObjectId(data.id)}, {
      type: data.type,
      updatedAt: new Date(),
    })

    return response
  } catch (error) {
    logger.error('Error updating user', error)
  }

  return false
}

export async function updatePassword (data: {
  id: string, 
  password: string,
}): Promise<boolean> {
  try {
    const response = await updateOne(DATASOURCE, {_id: new ObjectId(data.id)}, {
      password: data.password,
      updatedAt: new Date(),
    })

    return response
  } catch (error) {
    logger.error('Error updating user', error)
  }

  return false
}

export async function block (data: {id: string}): Promise<boolean> {
  try {
    const response = await updateOne(DATASOURCE, {_id: new ObjectId(data.id)}, { 
      active: 0,
      deletedAt: new Date(),
    })

    return response
  } catch (error) {
    logger.error('Error blocking user', error)
  }

  return false
}

export async function remove (data: {id: string}): Promise<boolean> {
  try {
    const response = await removeOne(DATASOURCE, {_id: new ObjectId(data.id)})

    return response
  } catch (error) {
    logger.error('Error removing user', error)
  }

  return false
}
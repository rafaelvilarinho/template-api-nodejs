import { ObjectId } from 'mongodb'
import { insertOne, removeOne, select, selectAll, selectById, updateOne } from '../../services/database'
import logger from '../../utils/logger'
import { UserDTO, UserType } from './users.types'

export async function list (): Promise<UserDTO[]> {
  try {
    const data = await selectAll<UserDTO>("users", {})

    return data
  } catch (error) {
    logger.error('Error getting all users', error)
  } 

  return []
}

export async function read (id: string): Promise<UserDTO | null> {
  try {
    const data = await selectById<UserDTO>("users", id)

    return data
  } catch (error) {
    logger.error('Error getting user by id', error)
  }

  return null
}

export async function readByEmail (email: string): Promise<UserDTO | null> {
  try {
    const data = await select<UserDTO>("users", { email })

    return data
  } catch (error) {
    logger.error('Error getting user by id', error)
  }

  return null
}

export async function store (name: string, email: string, password: string, type: UserType): Promise<string | null> {
  try {
    const data = await insertOne("users", {
      name,
      email,
      password,
      type,
      createdAt: new Date(),
      active: 1
    })

    return data
  } catch (error) {
    logger.error('Error creating user', error)
  }

  return null
}

export async function update (id: string, name: string): Promise<boolean> {
  try {
    const data = await updateOne("users", {_id: new ObjectId(id)}, {
      name,
    })

    return data
  } catch (error) {
    logger.error('Error updating user', error)
  }

  return false
}

export async function updateType (id: string, type: UserType): Promise<boolean> {
  try {
    const data = await updateOne("users", {_id: new ObjectId(id)}, {
      type,
      updatedAt: new Date(),
    })

    return data
  } catch (error) {
    logger.error('Error updating user', error)
  }

  return false
}

export async function updatePassword (id: string, password: string): Promise<boolean> {
  try {
    const data = await updateOne("users", {_id: new ObjectId(id)}, {
      password,
      updatedAt: new Date(),
    })

    return data
  } catch (error) {
    logger.error('Error updating user', error)
  }

  return false
}

export async function block (id: string): Promise<boolean> {
  try {
    const data = await updateOne("users", {_id: new ObjectId(id)}, { 
      active: 0,
      deletedAt: new Date(),
    })

    return data
  } catch (error) {
    logger.error('Error blocking user', error)
  }

  return false
}

export async function remove (id: string): Promise<boolean> {
  try {
    const data = await removeOne("users", {_id: new ObjectId(id)})

    return data
  } catch (error) {
    logger.error('Error removing user', error)
  }

  return false
}
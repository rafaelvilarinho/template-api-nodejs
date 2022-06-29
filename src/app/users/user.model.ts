
import logger from '../../utils/logger';
import { createHash } from '../../utils/crypt';
import { list, read, readByEmail, remove, store, update, updatePassword, updateType } from './users.repository';
import { CreateUserPayload, UpdateUserPayload, User, UserType } from './users.types';

export async function getAllUsers(): Promise<User[]> {
  return await list()
}

export async function getUserById(id: string): Promise<User | null> {
  return await read(id)
}

export async function createUser(data: CreateUserPayload): Promise<string | null> {
  try {
    const existingUser = await readByEmail(data.email)

    if (existingUser) {
      return 'existing'
    } else {
      const password = await createHash(data.password)
      const response = await store(data.name, data.email, password, data.type)
    
      return response
    }
  } catch (error) {
    logger.error('Error creating user', error)
  }

  return null
}

export async function updateUser(data: UpdateUserPayload): Promise<boolean> {
  try {  
    return await update(data.id, data.name)
  } catch (error) {
    logger.error('Error updating user', error)
  }

  return false
}

export async function updateUserType(data: { id: string, type: UserType }): Promise<boolean> {
  try {
    return await updateType(data.id, data.type)
  } catch (error) {
    logger.error('Error updating user type', error)
  }

  return false
}

export async function updateUserPassword(data: { id: string, password: string }): Promise<boolean> {
  try {
    return await updatePassword(data.id, data.password)
  } catch (error) {
    logger.error('Error updating user password', error)
  }

  return false
}

export async function removeUser(data: { id: string }): Promise<boolean> {
  try {
    return await remove(data.id)
  } catch (error) {
    logger.error('Error removing user', error)
  }

  return false
}
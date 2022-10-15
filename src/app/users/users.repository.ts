import { ObjectId } from 'mongodb'
import { insertOne, removeOne, select, selectAll, selectById, updateOne } from '../../services/database'
import logger from '../../utils/logger'
import { UserDTO, UserType } from './users.types'

const DATASOURCE = "users"

export async function list (): Promise<UserDTO[]> {
  const log = logger.child({ func: 'users.repository.list' })

  try {
    const data = await selectAll<UserDTO>(DATASOURCE, {})

    return data
  } catch (error) {
    log.error('Error on getting a list of users', error)
    throw error
  }
}

export async function read (data: {
  id: string
}): Promise<UserDTO | null> {
  const log = logger.child({ func: 'users.repository.read', id: data.id })

  try {
    const response = await selectById<UserDTO>(DATASOURCE, data.id)

    return response
  } catch (error) {
    log.error('Error on reading an user by id', error)

    throw error
  }
}

export async function readByEmail (data: { email: string }): Promise<UserDTO | null> {
  const log = logger.child({ func: 'users.repository.readByEmail', email: data.email })

  try {
    const response = await select<UserDTO>(DATASOURCE, { email: data.email })

    return response
  } catch (error) {
    log.error('Error on reading an user by email', error)

    throw error
  }
}

export async function store (data: {
  name: string,
  email: string,
  password: string,
  type: UserType,
  activation?: boolean,
}): Promise<string | null> {
  const log = logger.child({ func: 'users.repository.store', name: data.name, email: data.email, type: data.type })

  try {
    const response = await insertOne(DATASOURCE, {
      name: data.name,
      email: data.email,
      password: data.password,
      type: data.type,
      createdAt: new Date(),
      active: 1,
      emailConfirm: !data.activation
    })

    return response
  } catch (error) {
    log.error('Error on storing an user', error)

    throw error
  }
}

export async function update (data: {
  id: string,
  name: string,
}): Promise<boolean> {
  const log = logger.child({ func: 'users.repository.update', id: data.id, name: data.name })

  try {
    const response = await updateOne(DATASOURCE, {_id: new ObjectId(data.id)}, {
      name: data.name,
      updatedAt: new Date()
    })

    return response
  } catch (error) {
    log.error('Error on updating an user', error)

    throw error
  }
}

export async function updateEmailConfirm (data: {
  id: string,
  emailConfirm: boolean,
}): Promise<boolean> {
  const log = logger.child({ func: 'users.repository.updateEmailConfirm', id: data.id, emailConfirm: data.emailConfirm })

  try {
    const response = await updateOne(DATASOURCE, {_id: new ObjectId(data.id)}, {
      emailConfirm: data.emailConfirm,
      updatedAt: new Date()
    })

    return response
  } catch (error) {
    log.error('Error on updating emailConfirm field of user', error)

    throw error
  }
}

export async function updateType (data: {
  id: string,
  type: UserType
}): Promise<boolean> {
  const log = logger.child({ func: 'users.repository.updateType', ...data })

  try {
    const response = await updateOne(DATASOURCE, {_id: new ObjectId(data.id)}, {
      type: data.type,
      updatedAt: new Date(),
    })

    return response
  } catch (error) {
    log.error('Error on updating type of user', error)

    throw error
  }
}

export async function updatePassword (data: {
  id: string,
  password: string
}): Promise<boolean> {
  const log = logger.child({ func: 'users.repository.updatePassword', ...data })

  try {
    const response = await updateOne(DATASOURCE, {_id: new ObjectId(data.id)}, {
      password: data.password,
      updatedAt: new Date(),
    })

    return response
  } catch (error) {
    log.error('Error on updating password of user', error)

    throw error
  }
}

export async function block (data: {
  id: string
}): Promise<boolean> {
  const log = logger.child({ func: 'users.repository.block', ...data })

  try {
    const response = await updateOne(DATASOURCE, {_id: new ObjectId(data.id)}, { 
      active: 0,
      deletedAt: new Date(),
    })

    return response
  } catch (error) {
    log.error('Error on blocking an user', error)

    throw error
  }
}

export async function remove (data: {
  id: string
}): Promise<boolean> {
  const log = logger.child({ func: 'users.repository.remove', ...data })

  try {
    const response = await removeOne(DATASOURCE, {_id: new ObjectId(data.id)})

    return response
  } catch (error) {
    log.error('Error on removing an user', error)

    throw error
  }
}
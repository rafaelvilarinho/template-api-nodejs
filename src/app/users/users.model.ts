import logger from '../../utils/logger';
import { createHash, validateHash } from '../../utils/crypt';
import { list, read, readByEmail, remove, store, update, updateEmailConfirm, updatePassword, updateType } from './users.repository';
import { SigninUserResponse, User, UserType } from './users.types';
import { createToken } from '../../utils/token';
import { TokenUserPayload } from '../../utils/token/types';

export async function getAllUsers(): Promise<User[]> {
  const users = await list()

  return users.map<User>(user => ({ id: user._id, name: user.name, email: user.email, type: user.type }))
}

export async function getUserById(id: string): Promise<User | null> {
  const log = logger.child({ func: 'users.model.getUserById', id })

  try {
    const user = await read({id})
  
    if (user) {
      const {_id, name, email, type} = user
    
      return { id: _id, name, email, type }
    } else {
      return null
    }
  } catch (error) {
    log.error("Error on getting user by id", {error})

    throw error
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const log = logger.child({ func: 'users.model.getUserByEmail', email })

  try {
    const user = await readByEmail({email})
  
    if (user) {
      const {_id, name, email, type} = user
    
      return { id: _id, name, email, type }
    } else {
      return null
    }
  } catch (error) {
    log.error("Error on getting user by email", {error})

    throw error
  }
}

export async function getUserToken(user: User, expMilli?: number): Promise<string> {
  const log = logger.child({ func: 'users.model.getUserToken', user, expMilli })

  try {
    const tokenUserPayload: TokenUserPayload = {
      id: user.id as string,
      name: user.name,
      email: user.email,
      type: user.type,
    }
  
    const token = await createToken(tokenUserPayload, expMilli ? {exp: expMilli} : undefined)
  
    return token
  } catch (error) {
    log.error("Error on getting user token", {error})

    throw error
  }
}

export async function signinUser(email: string, password: string): Promise<SigninUserResponse | null> {
  const log = logger.child({ func: "users.model.signinUser", email })

  try {
    const existingUser = await readByEmail({email})

    if (existingUser) {
      const validation = await validateHash(password, existingUser.password)

      if (validation) {
        const tokenUserPayload: TokenUserPayload = {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          type: existingUser.type,
        }
        const token = await createToken(tokenUserPayload)

        return { 
          ...tokenUserPayload,
          emailConfirm: existingUser.emailConfirm,
          token
        }
      } 
    } 

    return {} as SigninUserResponse
  } catch (error) {
    log.error('Error on logging user', {error})

    throw error
  }
}

export async function confirmUserEmail(data: {
  id: string,
}): Promise<boolean> {
  const log = logger.child({ func: "users.model.confirmUserEmail", id: data.id })

  try {  
    const result = await updateEmailConfirm({...data, emailConfirm: true})

    if (result) return result
    else throw result
  } catch (error) {
    log.error('Error on updating user', {error})

    throw error
  }
}

export async function createUser(data: {
  name: string,
  email: string,
  password: string,
  type: UserType,
  activation?: boolean
}): Promise<string | null> {
  const log = logger.child({ func: "users.model.createUser", name: data.name, email: data.email, type: data.type })

  try {
    const existingUser = await readByEmail({email: data.email})

    if (existingUser) {
      return 'existing'
    } else {
      const password = await createHash(data.password)
      const response = await store({...data, password })
    
      if (response)
        return response
      else
        throw { name: data.name, email: data.email, type: data.type }
    }
  } catch (error) {
    log.error('Error on creating an user', {error})

    throw error
  }
}

export async function updateUser(data: {
  id: string,
  name: string,
  extraNotes?: string,
}): Promise<boolean> {
  const log = logger.child({ func: "users.model.updateUser", id: data.id, name: data.name })

  try {  
    const result = await update(data)

    if (result) return result
    else throw result
  } catch (error) {
    log.error('Error on updating user', {error})

    throw error
  }
}

export async function updateUserType(data: { id: string, type: UserType }): Promise<boolean> {
  const log = logger.child({ func: "users.model.updateUserType", ...data })

  try {
    const result = await updateType(data)

    if (result) return result
    else throw result
  } catch (error) {
    log.error('Error on updating user type', {error})

    throw error
  }
}

export async function updateUserPassword(data: { id: string, password: string }): Promise<boolean> {
  const log = logger.child({ func: "users.model.updateUserPassword", id: data.id })

  try {
    const password = await createHash(data.password)
    const result = await updatePassword({...data, password})

    if (result) return result
    else throw result
  } catch (error) {
    log.error('Error on updating user password', {error})

    throw error
  }
}

export async function removeUser(data: { id: string }): Promise<boolean> {
  const log = logger.child({ func: "users.model.removeUser", ...data })

  try {
    return await remove({id: data.id})
  } catch (error) {
    log.error('Error on removing user', {error})

    throw error
  }
}
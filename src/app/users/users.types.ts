import { GenericDTO } from '../../services/database/mongodb/types'

export type SigninUserResponse = {
  id: string,
  name: string,
  email: string,
  emailConfirm: Date | undefined,
  type: UserType,
  token: string,
  
}

export type UserDTO = {
  name: string,
  email: string,
  password: string,
  type: UserType,
  emailConfirm: Date | undefined,
} & GenericDTO

export type User = {
  id?: string,
  name: string,
  email: string,
  type: UserType,
}

export enum UserType {
  ADMIN='admin',
}
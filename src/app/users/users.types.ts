import { GenericDTO } from '../../services/database/mongodb/types'

export type SigninUserResponse = {
  id: string,
  name: string,
  email: string,
  type: UserType,
  token: string,
}

export type UserDTO = {
  name: string,
  email: string,
  password: string,
  type: UserType,
} & GenericDTO

export type User = {
  id?: string,
  name: string,
  email: string,
  type: UserType,
}

export enum UserType {
  ADMIN='admin',
  AUX='aux',
  COMMON='common'
}
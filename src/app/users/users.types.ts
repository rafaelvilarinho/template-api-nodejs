export type SigninUserResponse = {
  id: string,
  name: string,
  email: string,
  type: UserType,
  token: string,
}

export type CreateUserPayload = {
  name: string,
  email: string,
  password: string,
  type: UserType,
}

export type UpdateUserPayload = {
  id: string,
  name: string,
}

export type UserDTO = {
  _id: string,
  name: string,
  email: string,
  password: string,
  type: UserType,
  createdAt: Date | string,
  updatedAt: Date | string,
  deletedAt: Date | string,
  active: number
}

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
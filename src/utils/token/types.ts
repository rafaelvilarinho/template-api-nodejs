import { Request } from 'express';
import { UserType } from '../../app/users/users.types';

export type TokenUserPayload = { id: string, name: string, email: string, type: UserType }
export type RequestWithToken = Request & { user: TokenUserPayload }
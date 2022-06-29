import { Request } from 'express';

export type TokenUserPayload = { id: string, name: string, email: string }
export type RequestWithToken = Request & { user: TokenUserPayload }
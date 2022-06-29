import jwt from 'jsonwebtoken'
import { environment } from '../../config/environment'
import logger from '../logger'
import { TokenUserPayload } from './types'

const TOKEN_EXP_DEFAULT = 60 * 60 * 2

export async function createToken(data: any, options?: {
  exp: number
}) {
  try {
    const token = jwt.sign(data, environment.TOKEN_SECRET, {
      expiresIn: options?.exp || TOKEN_EXP_DEFAULT
    })
  
    return token
  } catch (error) {
    logger.error('Error generating token', data)
  }

  return ""
}

export function validateToken(token: string): TokenUserPayload | undefined {
  try {
    const payload = jwt.verify(token, environment.TOKEN_SECRET) as string
    return JSON.parse(payload) as TokenUserPayload
  } catch (error) {
    logger.error('Error validating token')
  }
}
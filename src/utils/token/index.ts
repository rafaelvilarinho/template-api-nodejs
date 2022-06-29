import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { environment } from '../../config/environment'
import logger from '../logger'
import { ErrorResponse, ErrorType } from '../response'
import { RequestWithToken, TokenUserPayload } from './types'

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
    return payload as unknown as TokenUserPayload
  } catch (error) {
    logger.error('Error validating token', error)
  }
}

export function validateTokenMiddleware(req: Request, res: Response, next: NextFunction): void | NextFunction {
  try {
    const xApiToken = req.headers['x-api-token'] as string

    if (xApiToken) {
      const payload = validateToken(xApiToken)

      if (payload) {
        (req as RequestWithToken).user = payload as TokenUserPayload

        return next()
      }
    } 

    ErrorResponse(res, ErrorType.NotAuthorized)
  } catch (error) {
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}
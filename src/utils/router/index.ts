import { NextFunction, Request, Response } from 'express';
import { ErrorResponse, ErrorType } from '../response';
import { validateToken } from '../token';
import { RequestWithToken, TokenUserPayload } from '../token/types';

export function validateTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const xApiToken = req.headers['x-api-token'] as string

    if (xApiToken) {
      const payload = validateToken(xApiToken)

      if (payload) {
        (req as RequestWithToken).user = payload as TokenUserPayload

        next()

        return
      }
    } 

    ErrorResponse(res, ErrorType.NotAuthorized)
  } catch (error) {
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}
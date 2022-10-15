import { NextFunction, Request, Response } from 'express';
import { MailingType, sendEmail } from '../../services/mailing';
import logger from '../../utils/logger';
import { logRequestPayload } from '../../utils/requests';
import { ErrorResponse, ErrorType, SuccessResponse } from '../../utils/response';
import { RequestWithToken } from '../../utils/token/types';
import { confirmUserEmail, createUser, getAllUsers, getUserByEmail, getUserById, getUserToken, removeUser, signinUser, updateUser, updateUserPassword, updateUserType } from './users.model';
import { UserType } from './users.types';

export async function getAllUsersRoute(req: Request, res: Response) {
  const log = logger.child({ func: 'users.controller.getAllUsersRoute', ...logRequestPayload(req) })

  try {
    const userList = await getAllUsers()

    SuccessResponse(res, userList) 
  } catch (error) {
    log.error('Error on getting all users', error)
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}

export async function getUserByIdRoute(req: Request, res: Response) {
  const log = logger.child({ func: 'users.controller.getUserByIdRoute', ...logRequestPayload(req) })
  
  try {
    const { id } = req.params

    if (!id) {
      ErrorResponse(res, ErrorType.BadRequest)
    } else {
      const user = await getUserById(id)

      if (user) {
        SuccessResponse(res, user) 
      } else {
        ErrorResponse(res, ErrorType.NotFound, { msg: "Usuário não encontrado" })
      }
  
    }
  } catch (error) {
    log.error('Error on getting an user', error)
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}

export async function signinUserRoute(req: Request, res: Response) {
  const log = logger.child({ func: 'users.controller.signinUserRoute', ...logRequestPayload(req) })

  try {
    const { email, password } = req.body

    if (!email || !password) {
      ErrorResponse(res, ErrorType.BadRequest)
    } else {
      const user = await signinUser(email, password)

      if (user) {
        if (user.id) {
          if (user.emailConfirm) {
            SuccessResponse(res, { user }) 
          } else {
            ErrorResponse(res, ErrorType.Forbidden, {msg: "Usuário ainda não confirmou o e-mail"})
          }
        } else {
          ErrorResponse(res, ErrorType.NotAuthorized, {msg: "Credenciais incorretas"})
        }
      } else {
        ErrorResponse(res, ErrorType.InternalServerError)
      }
    }
  } catch (error) {
    log.error('Error on signing an user', error)
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}

export async function createUserRoute(req: Request, res: Response) {
  const log = logger.child({ func: 'users.controller.createUserRoute', ...logRequestPayload(req) })

  try {
    const { name, email, password, type } = req.body

    if (!name || !email || !password || !type) {
      ErrorResponse(res, ErrorType.BadRequest)
    } else {
      const id = await createUser({
        name,
        email,
        password,
        type,
        activation: true
      })

      if (id) {
        if (id !== "existing") {
          const token = await getUserToken({id, name, email, type}, 1000 * 60 * 60 * 3)

          await sendEmail(
            [email],
            'Seja bem vindo ao Meu Aconselhamento',
            MailingType.SIGNUP_CONFIRM,
            { user: { name, email }, token }
          )

          SuccessResponse(res, { id })
        } else {
          ErrorResponse(res, ErrorType.Forbidden, {msg: "Usuário já existe"})
        }
      } else {
        ErrorResponse(res, ErrorType.InternalServerError)
      }
    }
  } catch (error) {
    log.error('Error on creating an user', error)
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}

export async function confirmAccountRoute(req: Request, res: Response) {
  const log = logger.child({ func: 'users.controller.confirmAccountRoute', ...logRequestPayload(req) })

  try {
    const { id } = (req as RequestWithToken).user

    if (!id) {
      ErrorResponse(res, ErrorType.BadRequest)
    } else {
      const result = await confirmUserEmail({ id })

      if (result) {
        SuccessResponse(res, { msg: "Conta confirmada com sucesso" })
      } else {
        log.error('Error on confirming an user email', {id})
        ErrorResponse(res, ErrorType.InternalServerError, {msg: "Ocorreu um erro ao confirmar a conta"})
      }
    }
  } catch (error) {
    log.error('Error on creating an user', error)
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}

export async function requestNewPasswordRoute(req: Request, res: Response) {
  const log = logger.child({ func: 'users.controller.requestNewPasswordRoute', ...logRequestPayload(req) })

  try {
    const { email } = req.body

    if (!email) {
      ErrorResponse(res, ErrorType.BadRequest)
    } else {
      const user = await getUserByEmail(email)
      
      if (user) {
        const token = await getUserToken(user, 1000 * 60 * 60 * 3)

        await sendEmail(
          [user.email],
          'Redefinição de senha solicitada',
          MailingType.PASSWORD_CHANGE_REQUEST,
          { user, token }
        )

        SuccessResponse(res, true)
      } else {
        ErrorResponse(res, ErrorType.InternalServerError)
      }
    }
  } catch (error) {
    log.error('Error on creating an user', error)
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}

export async function resetPasswordRoute(req: Request, res: Response) {
  const log = logger.child({ func: 'users.controller.requestNewPasswordRoute', ...logRequestPayload(req) })

  try {
    const { id } = (req as RequestWithToken).user
    const { password } = req.body

    if (!id) {
      ErrorResponse(res, ErrorType.BadRequest)
    } else {
      const ok = await updateUserPassword({ id, password })
      
      if (ok) {
        SuccessResponse(res, true)
      } else {
        ErrorResponse(res, ErrorType.InternalServerError)
      }
    }
  } catch (error) {
    log.error('Error on creating an user', error)
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}

export async function updateUserRoute(req: Request, res: Response) {
  const log = logger.child({ func: 'users.controller.updateUserRoute', ...logRequestPayload(req) })

  try {
    const { user, body } = req as RequestWithToken
    const { name } = body

    if (!name) {
      ErrorResponse(res, ErrorType.BadRequest)
    } else {
      const ok = await updateUser({id: user.id, name})

      if (ok) {
        SuccessResponse(res, true)
      } else {
        ErrorResponse(res, ErrorType.InternalServerError, {msg: "Ocorreu um erro durante a atualização do usuário"})
      }
    }
  } catch (error) {
    log.error('Error on update an user', error)
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}

export async function updateUserTypeRoute(req: Request, res: Response) {
  const log = logger.child({ func: 'users.controller.updateUserTypeRoute', ...logRequestPayload(req) })

  try {
    const { body, params } = req
    const { id } = params
    const { type } = body

    if (!type || !isUserType(type)) {
      ErrorResponse(res, ErrorType.BadRequest)
    } else {
      const ok = await updateUserType({id, type})

      if (ok) {
        SuccessResponse(res, true)
      } else {
        ErrorResponse(res, ErrorType.InternalServerError)
      }
    }
  } catch (error) {
    log.error('Error on update an user type', error)
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}

export async function updateUserPasswordRoute(req: Request, res: Response) {
  const log = logger.child({ func: 'users.controller.updateUserPasswordRoute', ...logRequestPayload(req) })
  
  try {
    const { body, params } = req
    const { id } = params
    const { password } = body

    if (!password) {
      ErrorResponse(res, ErrorType.BadRequest)
    } else {
      const ok = await updateUserPassword({id, password})

      if (ok) {
        SuccessResponse(res, true)
      } else {
        ErrorResponse(res, ErrorType.InternalServerError)
      }
    }
  } catch (error) {
    log.error('Error on update an user password', error)
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}

export async function removeUserRoute(req: Request, res: Response) {
  const log = logger.child({ func: 'users.controller.removeUserRoute', ...logRequestPayload(req) })

  try {
    const { user } = req as RequestWithToken

    if (!user.id) {
      ErrorResponse(res, ErrorType.BadRequest)
    } else {
      const ok = await removeUser({id: user.id})

      if (ok) {
        SuccessResponse(res, true)
      } else {
        ErrorResponse(res, ErrorType.InternalServerError)
      }
    }
  } catch (error) {
    log.error('Error on removing an user', error)
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}

// auxiliar functions
function isUserType(type: string) {
  switch (type) {
    case UserType.ADMIN:
      return true
    default:
      return false
  }
}

// Middlewares
export async function isAdminMiddleware(req: Request, res: Response, next: NextFunction): Promise<void | NextFunction> {
  const log = logger.child({ func: "user.controller.isAdminMiddleware" })

  try {
    const user = (req as RequestWithToken).user

    if (user) {
      if (user.type === UserType.ADMIN) {
        return next()
      }
    } 

    ErrorResponse(res, ErrorType.NotAuthorized)
  } catch (error) {
    log.error('Error on checking if user is admin', {error})
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}

export async function canUpdateMiddleware(req: Request, res: Response, next: NextFunction): Promise<void | NextFunction> {
  const log = logger.child({ func: "user.controller.canUpdateMiddleware" })

  try {
    const user = (req as RequestWithToken).user
    const { id } = req.params

    if (user) {
      if (
        user.type === UserType.ADMIN
        || user.id === id
      ) {
        return next()
      }
    } 

    ErrorResponse(res, ErrorType.NotAuthorized)
  } catch (error) {
    log.error('Error on checking if user can update', {error})
    ErrorResponse(res, ErrorType.InternalServerError, {}, error as Error)
  }
}
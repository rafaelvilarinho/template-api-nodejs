import { Router } from 'express'
import { validateTokenMiddleware } from '../../utils/token'
import { 
  canUpdateMiddleware,
  confirmAccountRoute,
  createUserRoute,
  getAllUsersRoute,
  getUserByIdRoute,
  isAdminMiddleware,
  removeUserRoute,
  requestNewPasswordRoute,
  resetPasswordRoute,
  signinUserRoute,
  updateUserPasswordRoute,
  updateUserRoute,
  updateUserTypeRoute
} from './users.controller'

const userRouter = Router()
const basePath = '/users'

userRouter.get(`${basePath}/confirm-account`, validateTokenMiddleware, confirmAccountRoute)
userRouter.get(`${basePath}/:id`, validateTokenMiddleware, getUserByIdRoute)
userRouter.get(`${basePath}/`, validateTokenMiddleware, getAllUsersRoute)

userRouter.post(`${basePath}/signup`, createUserRoute)
userRouter.post(`${basePath}/signin`, signinUserRoute)
userRouter.post(`${basePath}/request-new-password`, requestNewPasswordRoute)
userRouter.post(`${basePath}/reset-password`, validateTokenMiddleware, resetPasswordRoute)
userRouter.post(`${basePath}/`, validateTokenMiddleware, createUserRoute)

userRouter.patch(`${basePath}/:id/type`, validateTokenMiddleware, isAdminMiddleware, updateUserTypeRoute)
userRouter.patch(`${basePath}/:id/password`, validateTokenMiddleware, canUpdateMiddleware, updateUserPasswordRoute)
userRouter.patch(`${basePath}/:id`, validateTokenMiddleware, canUpdateMiddleware, updateUserRoute)

userRouter.delete(`${basePath}/:id`, validateTokenMiddleware, isAdminMiddleware, removeUserRoute)

export default userRouter
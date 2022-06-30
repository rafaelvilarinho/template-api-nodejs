import { Router } from 'express'
import { validateTokenMiddleware } from '../../utils/token'
import { createUserRoute, getAllUsersRoute, getUserByIdRoute, removeUserRoute, signinUserRoute, updateUserPasswordRoute, updateUserRoute, updateUserTypeRoute } from './users.controller'

const userRouter = Router()
const basePath = '/users'

userRouter.get(`${basePath}/:id`, validateTokenMiddleware, getUserByIdRoute)
userRouter.get(`${basePath}/`, validateTokenMiddleware, getAllUsersRoute)

userRouter.post(`${basePath}/signup`, createUserRoute)
userRouter.post(`${basePath}/signin`, signinUserRoute)
userRouter.post(`${basePath}/`, validateTokenMiddleware, createUserRoute)

userRouter.patch(`${basePath}/:id/type`, validateTokenMiddleware, updateUserTypeRoute)
userRouter.patch(`${basePath}/:id/password`, validateTokenMiddleware, updateUserPasswordRoute)
userRouter.patch(`${basePath}/:id`, validateTokenMiddleware, updateUserRoute)

userRouter.delete(`${basePath}/:id`, validateTokenMiddleware, removeUserRoute)

export default userRouter
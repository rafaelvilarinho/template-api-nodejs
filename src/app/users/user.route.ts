import {Router} from 'express'
import { validateTokenMiddleware } from '../../utils/router'
import { createUserRoute, getAllUsersRoute, getUserByIdRoute, removeUserRoute, updateUserPasswordRoute, updateUserRoute, updateUserTypeRoute } from './users.controller'

const router = Router()
const basePath = '/users'

router.get(`${basePath}/`, validateTokenMiddleware, getAllUsersRoute)
router.get(`${basePath}/:id`, validateTokenMiddleware, getUserByIdRoute)
router.post(`${basePath}/`, validateTokenMiddleware, createUserRoute)
router.patch(`${basePath}/:id`, validateTokenMiddleware, updateUserRoute)
router.patch(`${basePath}/:id/type`, validateTokenMiddleware, updateUserTypeRoute)
router.patch(`${basePath}/:id/password`, validateTokenMiddleware, updateUserPasswordRoute)
router.delete(`${basePath}/:id`, validateTokenMiddleware, removeUserRoute)

export default router
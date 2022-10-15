import cors from 'cors';
import express, { json, urlencoded } from "express"
import userRouter from './app/users/users.route';
import { environment } from './config/environment';
import logger from './utils/logger';

const app = express()

app.use(cors())
app.use(urlencoded())
app.use(json())

app.use('/', userRouter)

app.listen(environment.PORT, () => logger.info(`Running on server on ${environment.PORT} port`));
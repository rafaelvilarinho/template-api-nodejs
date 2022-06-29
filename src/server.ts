import cors from 'cors';
import express, { json, urlencoded } from "express"
import { environment } from './config/environment';

const app = express()

app.use(cors())
app.use(urlencoded())
app.use(json())

app.listen(environment.PORT);
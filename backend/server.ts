import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import ErrorResponse from './types/errorResponse';
import { search } from './search.controller';

const app = express()

app.use(cors())
app.use(morgan('dev'))

app.get('/check/:word', search)

app.all('*', (req, res, next) => next(new Error(`Route not found`)))

app.use((error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500).json({ success: false, data: error.message })
})
app.listen(3000, () => console.log(`listening on 3000`))
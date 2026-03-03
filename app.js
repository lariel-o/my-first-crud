import express from 'express';
import routers from './src/router/routers.js';

import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
dotenv.config();

import { query, queryFile } from './src/database/db.js';

queryFile('./src/database/querys/create-tables.sql');

const app = express();

app.get('/', (req, res)=>{
    return res.send("home!");
});

app.use(cookieParser(process.env.COOKIES_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routers
app.use('/', routers);

app.listen(8080);


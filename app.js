import express from 'express';
import routers from './src/router/routers.js';

import dotenv from 'dotenv';
dotenv.config();

import query from './src/database/db.js';

const app = express();

app.get('/', (req, res)=>{
    return res.send("home!");
})

app.use('/', routers);

app.listen(8080);


import { Router } from 'express';
import { queryFile } from '../database/db.js';
import { randomUUID } from 'crypto';
import { resolve } from 'path';
// import { queryFile } from '../database/querys/create-tables.sql';

const router = Router();

router.post('/auth/register', (req, res)=>{
    const { complete_name: completeName, nickname, password } = req.body;
    const id = randomUUID();

    if(!completeName || !nickname || !password){
        res.status(400);
        return res.send("Missing Fields");
    }

    queryFile(resolve('./src/database/querys/', './insert-users.sql'), 
        [id, completeName, nickname, password]);

    return res.send("Trying to register");
});

export default router;


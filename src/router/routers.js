import { Router } from 'express';
import { query, queryFile } from '../database/db.js';
import { randomUUID } from 'crypto';
import { resolve } from 'path';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/auth/register', async (req, res)=>{
    
    const { complete_name: completeName, nickname, password } = req.body;
    const id = randomUUID();

    if(!completeName || !nickname || !password){
        res.status(400);
        return res.send("Missing Fields");
    }

    const result = await queryFile(resolve('./src/database/querys/', './insert-users.sql'), 
        [id, completeName, nickname, password]);
    if(result.sucess == false){
        if(result.err.code == '23505'){
            if(result.err.constraint == 'users_id_key')
                return res.send("Sorry for the trouble, we had minor server issues, try again please");

            return res.send("This user already exist");
        };

        return res.send("Something unexpected happened");
    };

    return res.send("Your credentials have been registered");
});

router.post('/auth/login', async (req, res)=>{
    const { nickname, password } = req.body;

    // [START] Check if everything is fine to register
    if(!nickname || !password)
        return res.send("Missing fields");

    const result = await query("SELECT * FROM users WHERE nickname=$1", [nickname]);
    if(result.sucess == false)
        return res.send("Something unexpected happened");

    if(result.rowCount == 0)
        return res.send("User doesn't exists");

    if(result.data.rows[0].password != password)
        return res.send("Wrong password");
    // [END] Confirm that it's fine

    // [START] Create a JWT token and set it as a cookie
    const token = jwt.sign({nickname, password}, process.env.PASSWORD_SECRET);
    res.cookie('token', token, {
        encode: String,
        httpOnly: true,
        secure: true,
        signed: true
    });
    
    return res.send(token);
});

router.get('/auth/test', (req, res)=>{
    return res.send( req.signedCookies );
})

export default router;


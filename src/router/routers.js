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
        return res.status(400).send("Missing Fields");
    };

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
    // [END] 

    // [START] Create a JWT token and set it as a cookie
    const token = jwt.sign({nickname, password, type: "everything"}, process.env.PASSWORD_SECRET);
    res.cookie('token', token, {
        encode: String,
        httpOnly: true,
        secure: true,
        signed: true
    });
    // [END]
    
    return res.send(token);
});

router.get('/auth/test', (req, res)=>{
    const token = req.signedCookies.token;

    const decoded = jwt.verify(token, process.env.PASSWORD_SECRET);
    console.log(decoded);

    return res.send( req.signedCookies );
})

router.delete('/auth/delete', async (req, res)=>{
    const { nickname } = req.body;

    const token = req.signedCookies.token;
    if(!token)
        return res.send("Not allowed");

    const decoded = jwt.verify(token, process.env.PASSWORD_SECRET);
    if(decoded.type != "everything")
        return res.send("invalid token")

    const result = await queryFile(resolve('./src/database/querys/', './delete-user-by-nickname.sql'), [nickname]);

    if(result.sucess == false)
        return res.send("Error");

    return res.send("User deleted");
    
});

export default router;


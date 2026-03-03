import { Client } from 'pg';
import { readFileSync } from 'fs';

const query = async (q, values=null)=>{
    const client = new Client({
        user:           process.env.POSTGRES_USER,
        password:       process.env.POSTGRES_PASSWORD,
        host:           "database",
        port:           process.env.POSTGRES_PORT,
        database:       process.env.POSTGRES_USER
    });

    try{
        await client.connect();
        const data = await client.query(q, values);
        await client.end();

        return { data, sucess: true };
    }catch(err){
        const data = { err, sucess: false };
        console.log("ERR FROM SIMPLE QUERYS\n", data);
        return data; 
    }
}

const queryFile = async (a_path, values=null)=>{
    try{
        const q = readFileSync(a_path, 'ASCII');
        const data = query(q, values);

        return data;
    }catch(err){
        console.log("ERR FROM FILE QUERYS\n", err);
        return err;
    }
}

export { query, queryFile };


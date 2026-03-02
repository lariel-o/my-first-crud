import { Client } from 'pg';

const query = async (q)=>{
    const client = new Client({
        user:           process.env.POSTGRES_USER,
        password:       process.env.POSTGRES_PASSWORD,
        host:           "database",
        port:           process.env.POSTGRES_PORT,
        database:       process.env.POSTGRES_USER
    });

    await client.connect();
    const result = await client.query(q);
    await client.end();

    return result;
}

export default query;


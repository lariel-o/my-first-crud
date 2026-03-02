import { Router } from 'express';
const router = Router();

router.get('/auth/register', (req, res)=>{
    return res.send("Trying to register")
});

export default router;


import express from 'express';
import { updateuser,deleteUser,getUserlisting } from '../controller/user.controller.js';
import { verifyToken } from '../utils/verifytoken.js';
const router =express.Router();

router.post('/update/:id', verifyToken, updateuser)
router.delete('/delete/:id',verifyToken,deleteUser)
router.get('/listings/:id',verifyToken,getUserlisting);
export default router   
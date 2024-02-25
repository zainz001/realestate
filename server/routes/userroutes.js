import express from 'express';
import { updateuser,deleteUser,getUserlisting ,getuser} from '../controller/user.controller.js';
import { verifyToken } from '../utils/verifytoken.js';
const router =express.Router();

router.post('/update/:id', verifyToken, updateuser)
router.delete('/delete/:id',verifyToken,deleteUser)
router.get('/listings/:id',verifyToken,getUserlisting);


router.get("/:id",verifyToken,getuser)
export default router   
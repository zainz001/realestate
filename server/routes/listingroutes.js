import express from 'express';
import { createListing,deletelisting,getListing,updatelisting ,getlistings} from '../controller/listing.js';
import { verifyToken } from '../utils/verifytoken.js';
const router = express.Router();
router.post("/create",verifyToken,createListing);
router.delete("/delete/:id",verifyToken,deletelisting);

router.post("/update/:id",verifyToken,updatelisting);
router.get("/get/:id",getListing)
router.get("/get",getlistings)
export default router;
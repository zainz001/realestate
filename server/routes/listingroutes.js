import express from 'express';
import { createListing } from '../controller/listing.js';
import { verifyToken } from '../utils/verifytoken.js';
const router = express.Router();
router.post("/create",verifyToken,createListing);

export default router;
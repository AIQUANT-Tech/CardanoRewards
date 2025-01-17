import express from 'express';
import { editEndUserInfo } from './Loyalty_Enduser_Tier_Map_Controller.js';


const router = express.Router();

//Route to Edit end user info
router.post('/editEndUserInfo', editEndUserInfo);



export default router;
import express from 'express';
import { createUser, fetchEndUsersInfo, loginInfoForEndUser } from './Loyalty_User_Mast_Controller.js';

const router = express.Router();

//Route to register user
router.post('/createUser', createUser);

//Route to login user
router.post('/loginInfoForEndUser', loginInfoForEndUser);

//Route to fetch end user info
router.post('/fetchEndUsersInfo', fetchEndUsersInfo);


export default router;

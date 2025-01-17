import express from 'express';
import { fetchTierwiseRuleSetup, saveTierwiseRuleSetup } from './Loyalty_Tier_Wise_Rule_Setup_Controller.js';


const router = express.Router();

//Route to save rule
router.post('/saveTierwiseRuleSetup', saveTierwiseRuleSetup);

//Route to fetch rule
router.post('/fetchTierwiseRuleSetup', fetchTierwiseRuleSetup);


export default router;

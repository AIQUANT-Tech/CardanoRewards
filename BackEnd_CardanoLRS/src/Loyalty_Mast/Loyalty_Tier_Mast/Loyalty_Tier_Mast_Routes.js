import express from 'express';
import { createLoyaltyTiers, deleteLoyaltyTiers, editLoyaltyTiers, getLoyaltyTiersInfo } from './Loyalty_Tier_Mast_Controller.js';

const router = express.Router();

//Route to create tier
router.post('/createLoyaltyTiers', createLoyaltyTiers);

//Route to edit tier
router.post('/editLoyaltyTiers', editLoyaltyTiers);

//Route to delete tier
router.post('/deleteLoyaltyTiers', deleteLoyaltyTiers);

//Route to fetch and view tiers
router.post('/getLoyaltyTiersInfo', getLoyaltyTiersInfo);


export default router;

import express from 'express';
import { mappingLoyaltyOffersTiers, editMappingLoyaltyOffersTiers } from './Loyalty_Tier_Offer_Map_Controller.js';

const router = express.Router();

//Route to map offers with tiers
router.post('/mappingLoyaltyOffersTiers', mappingLoyaltyOffersTiers);

//Route to edit mapped offer and tiers
router.post('/editMappingLoyaltyOffersTiers', editMappingLoyaltyOffersTiers);




export default router;

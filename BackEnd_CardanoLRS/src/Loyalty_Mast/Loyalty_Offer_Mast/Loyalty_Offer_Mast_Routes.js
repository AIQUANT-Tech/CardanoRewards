import express from 'express';
import { createLoyaltyOffers, deleteLoyaltyOffers, editLoyaltyOffers, getLoyaltyOfferInfo } from './Loyalty_Offer_Mast_Controller.js';

const router = express.Router();

//Route to create a offer
router.post('/createLoyaltyOffers', createLoyaltyOffers);

//Route to edit a offer
router.post('/editLoyaltyOffers', editLoyaltyOffers);

//Route to delete a offer
router.post('/deleteLoyaltyOffers', deleteLoyaltyOffers);

//Route to fetch and view offer
router.post('/getLoyaltyOfferInfo', getLoyaltyOfferInfo);


export default router;

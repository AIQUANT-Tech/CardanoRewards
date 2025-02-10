import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { createLoyaltyOffers, editLoyaltyOffers, deleteLoyaltyOffers, getLoyaltyOfferInfo } from './Loyalty_Offer_Mast_Controller';
import LoyaltyOffer from "./Loyalty_Offer_Mast_Schema";

const app = express();
app.use(express.json());

app.post('/createLoyaltyOffers', createLoyaltyOffers);
app.post('/editLoyaltyOffers', editLoyaltyOffers);
app.post('/deleteLoyaltyOffers', deleteLoyaltyOffers);
app.post('/getLoyaltyOfferInfo', getLoyaltyOfferInfo);

beforeAll(async () => {
  await mongoose.connect("mongodb+srv://admin:admin@cardanolrs.s1zd2.mongodb.net/?retryWrites=true&w=majority&appName=CardanoLRS");
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Loyalty Offer Controller', () => {
  // Test for createLoyaltyOffers
  describe('POST /createLoyaltyOffers', () => {
    it('should create new loyalty offers', async () => {
      const payload = {
        "loyalty_offer_crud_rq": {
          "header": {
            "user_name": "businessUser",
            "product": "LRS",
            "request_type": "CREATE_LOYALTY_OFFER"
          },
          "offer_list": [
            {
              "offer_name": "Exclusive Access",
              "offer_desc": "Exclusive product launch preview",
              "status": "Active"
            },
            {
              "offer_name": "Priority Support",
              "offer_desc": "Enjoy priority access to our customer support team",
              "status": "Active"
            }
          ]
        }
      };

      const response = await request(app)
        .post('/createLoyaltyOffers')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body.loyalty_offer_crud_rs.status).toBe('success');
    }, 10000); // Increase timeout to 10 seconds

    it('should return error for invalid payload', async () => {
      const response = await request(app)
        .post('/createLoyaltyOffers')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.loyalty_offer_crud_rs.status).toBe('error');
    });
  });

  // Test for editLoyaltyOffers
  describe('POST /editLoyaltyOffers', () => {
    it('should edit existing loyalty offers', async () => {
      const payload = {
        "loyalty_offer_crud_rq": {
          "header": {
            "user_name": "businessUser",
            "product": "LRS",
            "request_type": "EDIT_LOYALTY_OFFER"
          },
          "offer_list": [
            {
              "offer_id": 13,
              "offer_name": "Exclusive Access",
              "offer_desc": "Exclusive product launch preview",
              "status": "Inactive"
            },
            {
              "offer_id": 14,
              "offer_name": "Priority Support",
              "offer_desc": "Enjoy priority access to our customer support team",
              "status": "Inactive"
            }
          ]
        }
      };

      const response = await request(app)
        .post('/editLoyaltyOffers')
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.loyalty_offer_crud_rs.status).toBe("success");
    }, 10000); // Increase timeout to 10 seconds

    it('should return error for missing offer_id', async () => {
      const payload = {
        "loyalty_offer_crud_rq": {
          "header": {
            "user_name": "businessUser",
            "product": "LRS",
            "request_type": "EDIT_LOYALTY_OFFER"
          },
          "offer_list": [
            {
              "offer_id": "",
              "offer_name": "Exclusive Access",
              "offer_desc": "Exclusive product launch preview",
              "status": "Inactive"
            },
            {
              "offer_id": 12,
              "offer_name": "Priority Support",
              "offer_desc": "Enjoy priority access to our customer support team",
              "status": "Inactive"
            }
          ]
        }
      };

      const response = await request(app)
        .post('/editLoyaltyOffers')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.loyalty_offer_crud_rs.status).toBe('error');
    });
  });

  // Test for deleteLoyaltyOffers
  describe('POST /deleteLoyaltyOffers', () => {
    it('should delete existing loyalty offers', async () => {
      const payload = {
        "loyalty_offer_crud_rq": {
          "header": {
            "user_name": "businessUser",
            "product": "LRS",
            "request_type": "DELETE_LOYALTY_OFFER"
          },
          "offer_list": [
            {
              "offer_id": "13"
            },
            {
              "offer_id": "14"
            }
          ]
        }
      };

      const response = await request(app)
        .post('/deleteLoyaltyOffers')
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.loyalty_offer_crud_rs.status).toBe('success');
    }, 10000); // Increase timeout to 10 seconds

    it('should return error for missing offer_id', async () => {
      const payload = {
        "loyalty_offer_crud_rq": {
          "header": {
            "user_name": "businessUser",
            "product": "LRS",
            "request_type": "DELETE_LOYALTY_OFFER"
          },
          "offer_list": [
            {
              "offer_id": ""
            },
            {
              "offer_id": ""
            }
          ]
        }
      };

      const response = await request(app)
        .post('/deleteLoyaltyOffers')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.loyalty_offer_crud_rs.status).toBe('error');
    });
  });

  // Test for getLoyaltyOfferInfo
  describe('POST /getLoyaltyOfferInfo', () => {
    it('should fetch all loyalty offers', async () => {
      const payload = {
        "loyalty_offer_fetch_rq": {
          "header": {
            "user_name": "businessUser",
            "product": "LRS",
            "request_type": "FETCH_LOYALTY_OFFER"
          }
        }
      };

      const response = await request(app)
        .post('/getLoyaltyOfferInfo')
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.loyalty_offer_fetch_rs.offer_list).toBeInstanceOf(Array);
    }, 10000); // Increase timeout to 10 seconds

    it('should return error for invalid request', async () => {
      const response = await request(app)
        .post('/getLoyaltyOfferInfo')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.loyalty_offer_fetch_rs.status).toBe('error');
    });
  });
});
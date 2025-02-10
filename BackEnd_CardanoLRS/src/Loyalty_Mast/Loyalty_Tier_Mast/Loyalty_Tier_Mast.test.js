import mongoose from 'mongoose';
import LoyaltyTier from './Loyalty_Tier_Mast_Schema.js';
import { createLoyaltyTiers, editLoyaltyTiers, deleteLoyaltyTiers, getLoyaltyTiersInfo } from './Loyalty_Tier_Mast_Controller.js';

jest.mock('./Loyalty_Tier_Mast_Schema.js');

describe('Loyalty Tier Controller Tests', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    jest.restoreAllMocks();
  });

  describe('Create Loyalty Tiers', () => {
    it('should create loyalty tiers successfully', async () => {
      const mockRequest = {
        body: {
            "loyalty_tier_crud_rq": {
              "header": {
                "user_name": "businessUser",
                "product": "LRS",
                "request_type": "CREATE_LOYALTY_TIER"
              },
              "tier_list": [
                {
                  "tier_name": "Platimun",
                  "tier_desc": "Platimun membership",
                  "status": "Active"
                },
                {
                  "tier_name": "Bronze",
                  "tier_desc": "Bronze membership",
                  "status": "Active"
                }
              ]
            }
          }
      };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      LoyaltyTier.prototype.save = jest.fn().mockResolvedValueOnce({});

      await createLoyaltyTiers(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        "loyalty_tier_crud_rs": {
            "status": "success"
        }
    });
    });

    it('should handle errors when creating loyalty tiers', async () => {
      const mockRequest = { body: {} };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      LoyaltyTier.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await createLoyaltyTiers(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        loyalty_tier_crud_rs: { status: 'failure' },
      });
    });
  });

  describe('Edit Loyalty Tiers', () => {
    it('should edit a loyalty tier successfully', async () => {
      const mockRequest = {
        body: {
            "loyalty_tier_crud_rq": {
              "header": {
                "user_name": "businessUser",
                "product": "LRS",
                "request_type": "EDIT_LOYALTY_TIER"
              },
              "tier_list": [
                {
                  "tier_id": "8",
                  "tier_name": "Silver",
                  "tier_desc": "Silver membership",
                  "Status": "Inactive"
                }
              ]
            }
          }
      };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      LoyaltyTier.findOne = jest.fn().mockResolvedValue({
        save: jest.fn().mockResolvedValue({}),
      });

      await editLoyaltyTiers(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        "loyalty_tier_crud_rs": {
            "status": "success"
        }
    });
    });

    it('should return error if tier is not found', async () => {
      const mockRequest = {
        body: {
            "loyalty_tier_crud_rq": {
              "header": {
                "user_name": "businessUser",
                "product": "LRS",
                "request_type": "EDIT_LOYALTY_TIER"
              },
              "tier_list": [
                {
                  "tier_id": "8776",
                  "tier_name": "Silver",
                  "tier_desc": "Silver membership",
                  "Status": "Inactive"
                }
              ]
            }
          },
      };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      LoyaltyTier.findOne = jest.fn().mockResolvedValue(null);

      await editLoyaltyTiers(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        loyalty_tier_crud_rs: { status: 'failure' },
      });
    });
  });

  describe('Delete Loyalty Tiers', () => {
    it('should delete a loyalty tier successfully', async () => {
      const mockRequest = {
        body: {
            "loyalty_tier_crud_rq": {
              "header": {
                "user_name": "businessUser",
                "product": "LRS",
                "request_type": "DELETE_LOYALTY_TIER"
              },
              "tier_list": [
                {
                  "tier_id": "8"
                }
              ]
            }
          },
      };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      LoyaltyTier.findOne = jest.fn().mockResolvedValue({});
      LoyaltyTier.deleteOne = jest.fn().mockResolvedValue({});

      await deleteLoyaltyTiers(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        "loyalty_offer_crud_rs": {
            "status": "success"
        }
    });
    });

    it('should return error if tier to delete is not found', async () => {
      const mockRequest = {
        body: {
          loyalty_tier_crud_rq: {
            tier_list: [{ tier_id: '999' }],
          },
        },
      };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      LoyaltyTier.findOne = jest.fn().mockResolvedValue(null);

      await deleteLoyaltyTiers(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        loyalty_offer_crud_rs: { status: 'failure' },
      });
    });
  });

  describe('Get Loyalty Tiers', () => {
    it('should fetch loyalty tiers successfully', async () => {
      const mockTiers = [
        { tier_id: '1', tier_name: 'Gold', tier_desc: 'Gold Desc', modified_by: 'admin', modified_at: new Date(), Status: 'Active' },
        { tier_id: '2', tier_name: 'Silver', tier_desc: 'Silver Desc', modified_by: 'admin', modified_at: new Date(), Status: 'Inactive' },
      ];
      const mockRequest = { body: {} };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      LoyaltyTier.find = jest.fn().mockResolvedValue(mockTiers);

      await getLoyaltyTiersInfo(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        loyalty_tier_fetch_rs: {
          tier_list: expect.arrayContaining([
            expect.objectContaining({ tier_name: 'Gold' }),
            expect.objectContaining({ tier_name: 'Silver' }),
          ]),
        },
      });
    });

    it('should return error if database fetch fails', async () => {
      const mockRequest = { body: {} };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      LoyaltyTier.find = jest.fn().mockRejectedValue(new Error('DB Fetch Error'));

      await getLoyaltyTiersInfo(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        loyalty_tier_fetch_rs: { status: 'failure' },
      });
    });
  });
});

import {
    mappingLoyaltyOffersTiers,
    editMappingLoyaltyOffersTiers,
  } from './Loyalty_Tier_Offer_Map_Controller';
  import LoyaltyTier from '../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema';
  import LoyaltyOffer from '../../Loyalty_Mast/Loyalty_Offer_Mast/Loyalty_Offer_Mast_Schema';
  import LoyaltyTierOfferMap from './Loyalty_Tier_Offer_Map_Schema';
  
  jest.mock('../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema');
  jest.mock('../../Loyalty_Mast/Loyalty_Offer_Mast/Loyalty_Offer_Mast_Schema');
  jest.mock('./Loyalty_Tier_Offer_Map_Schema');
  
  describe('mappingLoyaltyOffersTiers', () => {
    let mockRequest, mockResponse;
  
    beforeEach(() => {
      mockRequest = {
        body: {
          loyalty_offer_tier_mapping_rq: {
            "header": {
                "user_name": "businessUser",
                "product": "LRS",
                "request_type": "MAPPING_LOYALTY_OFFER_TIER"
            },
            mapping_info_offer_tier: [
              {
                offer_id: 1,
                tier_id: 101,
                Status: 'A',
              },
            ],
          },
        },
      };
  
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 200 and success status if mapping is successful', async () => {
      LoyaltyTier.findOne.mockResolvedValue({ tier_id: 101 });
      LoyaltyOffer.findOne.mockResolvedValue({ offer_id: 1 });
      LoyaltyTierOfferMap.findOne.mockResolvedValue(null);
  
      await mappingLoyaltyOffersTiers(mockRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        loyalty_offer_tier_mapping_rs: {
          status: 'success',
        },
      });
    });
  
    it('should return 500 if loyalty tier is not found', async () => {
      LoyaltyTier.findOne.mockResolvedValue(null);
      LoyaltyOffer.findOne.mockResolvedValue({ offer_id: 1 });
  
      await mappingLoyaltyOffersTiers(mockRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        loyalty_offer_tier_mapping_rs: {
          status: 'failure',
        },
      });
    });
  
    it('should return 500 if loyalty offer is not found', async () => {
      LoyaltyTier.findOne.mockResolvedValue({ tier_id: 101 });
      LoyaltyOffer.findOne.mockResolvedValue(null);
  
      await mappingLoyaltyOffersTiers(mockRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        loyalty_offer_tier_mapping_rs: {
          status: 'failure',
        },
      });
    });
  
    it('should update existing mapping if it exists', async () => {
      const mockExistingMapping = {
        status: 'A',
        modified_at: new Date(),
        modified_by: 'testUser',
        save: jest.fn().mockResolvedValue(true),
      };
  
      LoyaltyTier.findOne.mockResolvedValue({ tier_id: 101 });
      LoyaltyOffer.findOne.mockResolvedValue({ offer_id: 1 });
      LoyaltyTierOfferMap.findOne.mockResolvedValue(mockExistingMapping);
  
      await mappingLoyaltyOffersTiers(mockRequest, mockResponse);
  
      expect(mockExistingMapping.status).toBe('A');
      expect(mockExistingMapping.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        loyalty_offer_tier_mapping_rs: {
          status: 'success',
        },
      });
    });
  
    it('should handle errors and return 500', async () => {
      LoyaltyTier.findOne.mockRejectedValue(new Error('Database error'));
  
      await mappingLoyaltyOffersTiers(mockRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        loyalty_offer_tier_mapping_rs: {
          status: 'failure',
        },
      });
    });

    describe('editMappingLoyaltyOffersTiers', () => {
    let req, res;

    beforeEach(() => {
        req = {
        body: {
  "edit_loyalty_offer_tier_mapping_rq": {
    "header": {
      "user_name": "businessUser",
      "product": "LRS",
      "request_type": "EDIT_MAPPING_LOYALTY_OFFER_TIER"
    },
    "mapping_info_offer_tier": [
      {
        "mapping_id": "8",
        "Status": "I"
      },
      {
        "offer_id": "15",
        "tier_id": "20",
        "Status": "A"
      }
    ]
  }
}
        };

        res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
        };

        LoyaltyTierOfferMap.findOne = jest.fn();
        LoyaltyTierOfferMap.prototype.save = jest.fn();
    });

    it('should edit loyalty offers and tiers mapping successfully', async () => {
        LoyaltyTierOfferMap.findOne.mockResolvedValue({
        mapping_id: 1,
        status: 'A',
        save: jest.fn().mockResolvedValue(true)
        });

        await editMappingLoyaltyOffersTiers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
        edit_loyalty_offer_tier_mapping_rs: {
            status: 'success'
        }
        });
    });

    it('should handle invalid status value', async () => {
        req.body.edit_loyalty_offer_tier_mapping_rq.mapping_info_offer_tier[0].Status = 'X';

        await editMappingLoyaltyOffersTiers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
        edit_loyalty_offer_tier_mapping_rs: {
            status: 'failure',
            error: 'Invalid status value provided: X'
        }
        });
    });

    it('should handle missing mapping', async () => {
        LoyaltyTierOfferMap.findOne.mockResolvedValue(null);

        await editMappingLoyaltyOffersTiers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
        edit_loyalty_offer_tier_mapping_rs: {
            status: 'failure',
            error: 'Mapping with mapping_id 8 not found'
        }
        });
    });
    });
});
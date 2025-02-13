// import {
//     mappingLoyaltyOffersTiers,
//     editMappingLoyaltyOffersTiers,
//   } from './Loyalty_Tier_Offer_Map_Controller';
//   import LoyaltyTier from '../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema';
//   import LoyaltyOffer from '../../Loyalty_Mast/Loyalty_Offer_Mast/Loyalty_Offer_Mast_Schema';
//   import LoyaltyTierOfferMap from './Loyalty_Tier_Offer_Map_Schema';
  
//   jest.mock('../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema');
//   jest.mock('../../Loyalty_Mast/Loyalty_Offer_Mast/Loyalty_Offer_Mast_Schema');
//   jest.mock('./Loyalty_Tier_Offer_Map_Schema');
  
//   describe('mappingLoyaltyOffersTiers', () => {
//     let mockRequest, mockResponse;
  
//     beforeEach(() => {
//       mockRequest = {
//         body: {
//           loyalty_offer_tier_mapping_rq: {
//             "header": {
//                 "user_name": "businessUser",
//                 "product": "LRS",
//                 "request_type": "MAPPING_LOYALTY_OFFER_TIER"
//             },
//             mapping_info_offer_tier: [
//               {
//                 offer_id: 1,
//                 tier_id: 101,
//                 Status: 'A',
//               },
//             ],
//           },
//         },
//       };
  
//       mockResponse = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };
//     });
  
//     afterEach(() => {
//       jest.clearAllMocks();
//     });
  
//     it('should return 200 and success status if mapping is successful', async () => {
//       LoyaltyTier.findOne.mockResolvedValue({ tier_id: 101 });
//       LoyaltyOffer.findOne.mockResolvedValue({ offer_id: 1 });
//       LoyaltyTierOfferMap.findOne.mockResolvedValue(null);
  
//       await mappingLoyaltyOffersTiers(mockRequest, mockResponse);
  
//       expect(mockResponse.status).toHaveBeenCalledWith(200);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         loyalty_offer_tier_mapping_rs: {
//           status: 'success',
//         },
//       });
//     });
  
//     it('should return 500 if loyalty tier is not found', async () => {
//       LoyaltyTier.findOne.mockResolvedValue(null);
//       LoyaltyOffer.findOne.mockResolvedValue({ offer_id: 1 });
  
//       await mappingLoyaltyOffersTiers(mockRequest, mockResponse);
  
//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         loyalty_offer_tier_mapping_rs: {
//           status: 'failure',
//         },
//       });
//     });
  
//     it('should return 500 if loyalty offer is not found', async () => {
//       LoyaltyTier.findOne.mockResolvedValue({ tier_id: 101 });
//       LoyaltyOffer.findOne.mockResolvedValue(null);
  
//       await mappingLoyaltyOffersTiers(mockRequest, mockResponse);
  
//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         loyalty_offer_tier_mapping_rs: {
//           status: 'failure',
//         },
//       });
//     });
  
//     it('should update existing mapping if it exists', async () => {
//       const mockExistingMapping = {
//         status: 'A',
//         modified_at: new Date(),
//         modified_by: 'testUser',
//         save: jest.fn().mockResolvedValue(true),
//       };
  
//       LoyaltyTier.findOne.mockResolvedValue({ tier_id: 101 });
//       LoyaltyOffer.findOne.mockResolvedValue({ offer_id: 1 });
//       LoyaltyTierOfferMap.findOne.mockResolvedValue(mockExistingMapping);
  
//       await mappingLoyaltyOffersTiers(mockRequest, mockResponse);
  
//       expect(mockExistingMapping.status).toBe('A');
//       expect(mockExistingMapping.save).toHaveBeenCalled();
//       expect(mockResponse.status).toHaveBeenCalledWith(200);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         loyalty_offer_tier_mapping_rs: {
//           status: 'success',
//         },
//       });
//     });
  
//     it('should handle errors and return 500', async () => {
//       LoyaltyTier.findOne.mockRejectedValue(new Error('Database error'));
  
//       await mappingLoyaltyOffersTiers(mockRequest, mockResponse);
  
//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         loyalty_offer_tier_mapping_rs: {
//           status: 'failure',
//         },
//       });
//     });

//     describe('editMappingLoyaltyOffersTiers', () => {
//     let req, res;

//     beforeEach(() => {
//         req = {
//         body: {
//   "edit_loyalty_offer_tier_mapping_rq": {
//     "header": {
//       "user_name": "businessUser",
//       "product": "LRS",
//       "request_type": "EDIT_MAPPING_LOYALTY_OFFER_TIER"
//     },
//     "mapping_info_offer_tier": [
//       {
//         "mapping_id": "8",
//         "Status": "I"
//       },
//       {
//         "offer_id": "15",
//         "tier_id": "20",
//         "Status": "A"
//       }
//     ]
//   }
// }
//         };

//         res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn()
//         };

//         LoyaltyTierOfferMap.findOne = jest.fn();
//         LoyaltyTierOfferMap.prototype.save = jest.fn();
//     });

//     it('should edit loyalty offers and tiers mapping successfully', async () => {
//         LoyaltyTierOfferMap.findOne.mockResolvedValue({
//         mapping_id: 1,
//         status: 'A',
//         save: jest.fn().mockResolvedValue(true)
//         });

//         await editMappingLoyaltyOffersTiers(req, res);

//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(res.json).toHaveBeenCalledWith({
//         edit_loyalty_offer_tier_mapping_rs: {
//             status: 'success'
//         }
//         });
//     });

//     it('should handle invalid status value', async () => {
//         req.body.edit_loyalty_offer_tier_mapping_rq.mapping_info_offer_tier[0].Status = 'X';

//         await editMappingLoyaltyOffersTiers(req, res);

//         expect(res.status).toHaveBeenCalledWith(500);
//         expect(res.json).toHaveBeenCalledWith({
//         edit_loyalty_offer_tier_mapping_rs: {
//             status: 'failure',
//             error: 'Invalid status value provided: X'
//         }
//         });
//     });

//     it('should handle missing mapping', async () => {
//         LoyaltyTierOfferMap.findOne.mockResolvedValue(null);

//         await editMappingLoyaltyOffersTiers(req, res);

//         expect(res.status).toHaveBeenCalledWith(500);
//         expect(res.json).toHaveBeenCalledWith({
//         edit_loyalty_offer_tier_mapping_rs: {
//             status: 'failure',
//             error: 'Mapping with mapping_id 8 not found'
//         }
//         });
//     });
//     });
// });


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
          header: {
            user_name: "businessUser",
            product: "LRS",
            request_type: "MAPPING_LOYALTY_OFFER_TIER",
          },
          mapping_info_offer_tier: [
            {
              offer_id: 1,
              tier_id: 101,
              Status: "A",
            },
          ],
        },
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 200 and success status if mapping is successful (new mapping)', async () => {
    // Simulate finding a valid loyalty tier and offer.
    LoyaltyTier.findOne.mockResolvedValue({ tier_id: 101 });
    LoyaltyOffer.findOne.mockResolvedValue({ offer_id: 1 });
    // Simulate that no existing mapping was found.
    LoyaltyTierOfferMap.findOne.mockResolvedValue(null);

    // When creating a new mapping, the constructor is called.
    // We simulate the instance having a save() method.
    const saveMock = jest.fn().mockResolvedValue(true);
    LoyaltyTierOfferMap.mockImplementation(() => ({ save: saveMock }));

    await mappingLoyaltyOffersTiers(mockRequest, mockResponse);

    // Check that the lookup functions were called with the proper query.
    expect(LoyaltyTier.findOne).toHaveBeenCalledWith({ tier_id: 101 });
    expect(LoyaltyOffer.findOne).toHaveBeenCalledWith({ offer_id: 1 });
    expect(LoyaltyTierOfferMap.findOne).toHaveBeenCalledWith({
      tier_id: 101,
      offer_id: 1,
    });
    // Ensure that save() was called on the new mapping instance.
    expect(saveMock).toHaveBeenCalled();

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      loyalty_offer_tier_mapping_rs: { status: "success" },
    });
  });

  it('should return 500 if loyalty tier is not found', async () => {
    // Simulate loyalty tier not found.
    LoyaltyTier.findOne.mockResolvedValue(null);
    LoyaltyOffer.findOne.mockResolvedValue({ offer_id: 1 });

    await mappingLoyaltyOffersTiers(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      loyalty_offer_tier_mapping_rs: { status: "failure" },
    });
  });

  it('should return 500 if loyalty offer is not found', async () => {
    // Simulate loyalty offer not found.
    LoyaltyTier.findOne.mockResolvedValue({ tier_id: 101 });
    LoyaltyOffer.findOne.mockResolvedValue(null);

    await mappingLoyaltyOffersTiers(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      loyalty_offer_tier_mapping_rs: { status: "failure" },
    });
  });

  it('should update existing mapping if it exists', async () => {
    // Simulate an existing mapping found (with a save method).
    const existingMapping = {
      status: "A",
      modified_at: new Date(),
      modified_by: "testUser",
      save: jest.fn().mockResolvedValue(true),
    };

    LoyaltyTier.findOne.mockResolvedValue({ tier_id: 101 });
    LoyaltyOffer.findOne.mockResolvedValue({ offer_id: 1 });
    LoyaltyTierOfferMap.findOne.mockResolvedValue(existingMapping);

    await mappingLoyaltyOffersTiers(mockRequest, mockResponse);

    expect(existingMapping.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      loyalty_offer_tier_mapping_rs: { status: "success" },
    });
  });

  it('should handle errors and return 500', async () => {
    // Simulate an error during the tier lookup.
    LoyaltyTier.findOne.mockRejectedValue(new Error("Database error"));

    await mappingLoyaltyOffersTiers(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      loyalty_offer_tier_mapping_rs: { status: "failure" },
    });
  });
});

describe("editMappingLoyaltyOffersTiers", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        edit_loyalty_offer_tier_mapping_rq: {
          header: {
            user_name: "businessUser",
            product: "LRS",
            request_type: "EDIT_MAPPING_LOYALTY_OFFER_TIER",
          },
          mapping_info_offer_tier: [
            {
              mapping_id: "8",
              Status: "I",
            },
            {
              offer_id: "15",
              tier_id: "20",
              Status: "A",
            },
          ],
        },
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should edit loyalty offers and tiers mapping successfully", async () => {
    // For the mapping that should be inactivated:
    const existingMapping = {
      mapping_id: "8",
      status: "A",
      save: jest.fn().mockResolvedValue(true),
    };

    // When searching by mapping_id, return the existing mapping.
    LoyaltyTierOfferMap.findOne.mockImplementation((query) => {
      if (query.mapping_id) {
        return Promise.resolve(existingMapping);
      }
      return Promise.resolve(null);
    });

    // For new mapping creation, simulate that the constructor returns an instance with a save method.
    const saveMockNewMapping = jest.fn().mockResolvedValue(true);
    LoyaltyTierOfferMap.mockImplementation(() => ({ save: saveMockNewMapping }));

    await editMappingLoyaltyOffersTiers(req, res);

    // Check that the existing mapping was updated.
    expect(existingMapping.save).toHaveBeenCalled();
    // And the new mapping (for offer_id/tier_id) was created.
    expect(saveMockNewMapping).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      edit_loyalty_offer_tier_mapping_rs: { status: "success" },
    });
  });

  it("should handle invalid status value", async () => {
    // Set an invalid status for the first mapping entry.
    req.body.edit_loyalty_offer_tier_mapping_rq.mapping_info_offer_tier[0].Status =
      "X";

    await editMappingLoyaltyOffersTiers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      edit_loyalty_offer_tier_mapping_rs: {
        status: "failure",
        error: "Invalid status value provided: X",
      },
    });
  });

  it("should handle missing mapping", async () => {
    // For mapping_id lookup, simulate no mapping is found.
    LoyaltyTierOfferMap.findOne.mockResolvedValue(null);

    await editMappingLoyaltyOffersTiers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      edit_loyalty_offer_tier_mapping_rs: {
        status: "failure",
        error: "Mapping with mapping_id 8 not found",
      },
    });
  });
});

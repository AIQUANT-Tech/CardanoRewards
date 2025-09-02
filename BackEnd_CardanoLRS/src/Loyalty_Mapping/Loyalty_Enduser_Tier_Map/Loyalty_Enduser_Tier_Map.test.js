// import { editEndUserInfo } from './Loyalty_Enduser_Tier_Map_Controller';
// import User from '../../Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema';
// import LoyaltyTier from '../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema';
// import LoyaltyEndUserTierMap from './Loyalty_Enduser_Tier_Map_Schema';

// jest.mock('../../Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema');
// jest.mock('../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema');
// jest.mock('./Loyalty_Enduser_Tier_Map_Schema');

// describe('editEndUserInfo', () => {
//   let mockRequest, mockResponse;

//   beforeEach(() => {
//     mockRequest = {
//       body: {
//         loyalty_end_user_edit_rq: {
//           user_info_list: {
//             user_info: [
//               {
//                 user_id: 1,
//                 tier: {
//                   tier_id: 101,
//                 },
//               },
//             ],
//           },
//         },
//       },
//     };

//     mockResponse = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should return 404 if user is not found', async () => {
//     User.findOne.mockResolvedValue(null);

//     await editEndUserInfo(mockRequest, mockResponse);

//     expect(mockResponse.status).toHaveBeenCalledWith(404);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       message: 'User with ID 1 not found.',
//     });
//   });

//   it('should return 400 if tier does not exist', async () => {
//     User.findOne.mockResolvedValue({ user_id: 1 });
//     LoyaltyTier.findOne.mockResolvedValue(null);

//     await editEndUserInfo(mockRequest, mockResponse);

//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       message: 'Tier with ID 101 does not exist.',
//     });
//   });

//   it('should update existing mapping if it exists', async () => {
//     const mockUser = { user_id: 1 };
//     const mockTier = { tier_id: 101 };
//     const mockExistingMapping = {
//       tier_id: 101,
//       modified_at: new Date(),
//       modified_by: 'user',
//       last_tier_assigned_at: new Date(),
//       save: jest.fn().mockResolvedValue(true),
//     };

//     User.findOne.mockResolvedValue(mockUser);
//     LoyaltyTier.findOne.mockResolvedValue(mockTier);
//     LoyaltyEndUserTierMap.findOne.mockResolvedValue(mockExistingMapping);

//     await editEndUserInfo(mockRequest, mockResponse);

//     expect(mockExistingMapping.tier_id).toBe(101);
//     expect(mockExistingMapping.save).toHaveBeenCalled();
//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       loyalty_end_user_edit_rs: {
//         status: 'success',
//       },
//     });
//   });

//   it('should create new mapping if it does not exist', async () => {
//     const mockUser = { user_id: 1 };
//     const mockTier = { tier_id: 101 };
//     const mockNewMapping = {
//       mapping_id: expect.any(String),
//       user_id: 1,
//       tier_id: 101,
//       created_by: 'user',
//       modified_by: 'user',
//       modified_at: expect.any(Date),
//       last_tier_assigned_at: expect.any(Date),
//       status: 'A',
//       save: jest.fn().mockResolvedValue(true),
//     };

//     User.findOne.mockResolvedValue(mockUser);
//     LoyaltyTier.findOne.mockResolvedValue(mockTier);
//     LoyaltyEndUserTierMap.findOne.mockResolvedValue(null);
//     LoyaltyEndUserTierMap.mockImplementation(() => mockNewMapping);

//     await editEndUserInfo(mockRequest, mockResponse);

//     expect(LoyaltyEndUserTierMap).toHaveBeenCalledWith({
//       mapping_id: expect.any(String),
//       user_id: 1,
//       tier_id: 101,
//       created_by: 'user',
//       modified_by: 'user',
//       modified_at: expect.any(Date),
//       last_tier_assigned_at: expect.any(Date),
//       status: 'A',
//     });
//     expect(mockNewMapping.save).toHaveBeenCalled();
//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       loyalty_end_user_edit_rs: {
//         status: 'success',
//       },
//     });
//   });

//   it('should handle errors and return 500', async () => {
//     User.findOne.mockRejectedValue(new Error('Database error'));

//     await editEndUserInfo(mockRequest, mockResponse);

//     expect(mockResponse.status).toHaveBeenCalledWith(500);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       message: 'An error occurred while editing end user tier information',
//     });
//   });
// });



import { editEndUserInfo } from './Loyalty_Enduser_Tier_Map_Controller';
import User from '../../Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema';
import LoyaltyTier from '../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema';
import LoyaltyEndUserTierMap from './Loyalty_Enduser_Tier_Map_Schema';

jest.mock('../../Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema');
jest.mock('../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema');
jest.mock('./Loyalty_Enduser_Tier_Map_Schema');

describe('editEndUserInfo', () => {
  let mockRequest, mockResponse;
  let consoleErrorSpy;

  beforeEach(() => {
    // Suppress console.error output during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockRequest = {
      body: {
        loyalty_end_user_edit_rq: {
          user_info_list: {
            user_info: [
              {
                user_id: 1,
                tier: {
                  tier_id: 101,
                },
              },
            ],
          },
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
    consoleErrorSpy.mockRestore();
  });

  it('should return 404 if user is not found', async () => {
    User.findOne.mockResolvedValue(null);

    await editEndUserInfo(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User with ID 1 not found.',
    });
  });

  it('should return 400 if tier does not exist', async () => {
    User.findOne.mockResolvedValue({ user_id: 1 });
    LoyaltyTier.findOne.mockResolvedValue(null);

    await editEndUserInfo(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Tier with ID 101 does not exist.',
    });
  });

  it('should update existing mapping if it exists', async () => {
    const mockUser = { user_id: 1 };
    const mockTier = { tier_id: 101 };
    const mockExistingMapping = {
      tier_id: 101,
      modified_at: new Date(),
      modified_by: 'user',
      last_tier_assigned_at: new Date(),
      save: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockResolvedValue(mockUser);
    LoyaltyTier.findOne.mockResolvedValue(mockTier);
    LoyaltyEndUserTierMap.findOne.mockResolvedValue(mockExistingMapping);

    await editEndUserInfo(mockRequest, mockResponse);

    expect(mockExistingMapping.tier_id).toBe(101);
    expect(mockExistingMapping.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      loyalty_end_user_edit_rs: {
        status: 'success',
      },
    });
  });

  it('should create new mapping if it does not exist', async () => {
    const mockUser = { user_id: 1 };
    const mockTier = { tier_id: 101 };
    const mockNewMapping = {
      mapping_id: expect.any(String),
      user_id: 1,
      tier_id: 101,
      created_by: 'user',
      modified_by: 'user',
      modified_at: expect.any(Date),
      last_tier_assigned_at: expect.any(Date),
      status: 'A',
      save: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockResolvedValue(mockUser);
    LoyaltyTier.findOne.mockResolvedValue(mockTier);
    LoyaltyEndUserTierMap.findOne.mockResolvedValue(null);
    LoyaltyEndUserTierMap.mockImplementation(() => mockNewMapping);

    await editEndUserInfo(mockRequest, mockResponse);

    expect(LoyaltyEndUserTierMap).toHaveBeenCalledWith({
      mapping_id: expect.any(String),
      user_id: 1,
      tier_id: 101,
      created_by: 'user',
      modified_by: 'user',
      modified_at: expect.any(Date),
      last_tier_assigned_at: expect.any(Date),
      status: 'A',
    });
    expect(mockNewMapping.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      loyalty_end_user_edit_rs: {
        status: 'success',
      },
    });
  });

  it('should handle errors and return 500', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));

    await editEndUserInfo(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'An error occurred while editing end user tier information',
    });
  });
});

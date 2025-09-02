import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./Loyalty_User_Mast_Schema.js";
import {
  createUser,
  loginInfoForBusinessUser,
  loginInfoForEndUser,
  fetchEndUsersInfo,
} from "./Loyalty_User_Mast_Controller.js";
import { generateToken } from "../../auth/jwtUtil.js";

jest.mock("./Loyalty_User_Mast_Schema.js");
jest.mock("../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema.js");
jest.mock("../../Loyalty_Mast/Loyalty_Offer_Mast/Loyalty_Offer_Mast_Schema.js");
jest.mock(
  "../../Loyalty_Rule_and_Transaction/Loyalty_User_Wallet_Transaction/Loyalty_User_Wallet_Transaction_Schema.js"
);
jest.mock("../../auth/jwtUtil.js");

describe("Loyalty User Controller Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    jest.restoreAllMocks();
  });

  //Create User
  describe("Create User", () => {
    it("should create a new user successfully", async () => {
      const mockRequest = {
        body: {
          email: "user@example.com",
          password: "user",
          first_name: "John",
          last_name: "Doe",
          wallet_address: "0x1234567890abcdef",
          role: "End User",
        },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue({
        message: "User created successfully",
        user: {
          user_id: 26,
          email: "user@example.com",
          first_name: "John",
          last_name: "Doe",
          wallet_address: "0x1234567890abcdef",
          role: "End User",
          created_at: "2025-02-06T06:52:13.809Z",
        },
      });

      await createUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User created successfully" })
      );
    });

    it("should return error if email already exists", async () => {
      User.findOne.mockResolvedValue({ email: "test@example.com" });

      const mockRequest = {
        body: { email: "test@example.com", password: "Test@123" },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Email already exists",
      });
    });
  });

  // Login Business User
  // describe('Login Business User', () => {
  //   it('should log in a business user successfully', async () => {
  //     const mockRequest = {
  //       body: {
  //           "loyalty_end_user_login_rq": {
  //             "header": {
  //               "product": "LRS",
  //               "request_type": "BUSINESS_USER_LOGIN"
  //             },
  //             "user_info": {
  //               "email": "souvagyadas56@gmail.com",
  //               "password": "Dasriju@02"
  //             }
  //           }
  //         },
  //     };
  //     const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  //     User.findOne.mockResolvedValue({
  //       "loyalty_business_user_login_rs": {
  //           "status": "success",
  //           "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvdXZhZ3lhZGFzNTZAZ21haWwuY29tIiwicm9sZSI6IkJ1c2luZXNzIFVzZXIiLCJpYXQiOjE3Mzg4MjY4MjgsImV4cCI6MTczODgzMDQyOH0.bCYZ7vuhfUdNagc09oHJ8Hk832Fq7xAKw7iVGlZ5Ffo",
  //           "message": "Login successful",
  //           "user_info": {
  //               "user_id": 10,
  //               "username": "Souvagya Das",
  //               "email": "souvagyadas56@gmail.com",
  //               "tier": {
  //                   "tier_id": null,
  //                   "tier_name": "No Tier"
  //               },
  //               "assigned_offers": [],
  //               "wallet_info": {
  //                   "ada_balance": 1200,
  //                   "rewards_earned": 800,
  //                   "rewards_spent": 300,
  //                   "rewards_balance": 500,
  //                   "transactions": []
  //               }
  //           }
  //       }
  //   });
  //     generateToken.mockReturnValue('mock_token');

  //     await loginInfoForBusinessUser(mockRequest, mockResponse);

  //     expect(mockResponse.status).toHaveBeenCalledWith(200);
  //     expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ loyalty_business_user_login_rs: { status: 'success' } }));
  //   });

  //   it('should return error if email is not found', async () => {
  //     User.findOne.mockResolvedValue(null);

  //     const mockRequest = {
  //       body: {
  //           "loyalty_end_user_login_rq": {
  //             "header": {
  //               "product": "LRS",
  //               "request_type": "BUSINESS_USER_LOGIN"
  //             },
  //             "user_info": {
  //               "email": "souvagyada56@gmail.com",
  //               "password": "Dasriju@02"
  //             }
  //           }
  //         },
  //     };
  //     const mockResponse = { status: jest.fn().mockReturnThis({
  //       "loyalty_end_user_login_rs": {
  //           "status": "failure",
  //           "message": "User not found"
  //       }
  //   }), json: jest.fn() };

  //     await loginInfoForBusinessUser(mockRequest, mockResponse);

  //     expect(mockResponse.status).toHaveBeenCalledWith(404);
  //     expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ loyalty_end_user_login_rs: { status: 'failure', message: 'User not found' } }));
  //   });
  // });

  //Login End User
  // describe('Login End User', () => {
  //   it('should log in an end user successfully', async () => {
  //     const mockRequest = {
  //       body: {
  //           "loyalty_end_user_login_rq": {
  //             "header": {
  //               "product": "LRS",
  //               "request_type": "END_USER_LOGIN"
  //             },
  //             "user_info": {
  //               "email": "abc56@gmail.com",
  //               "password": "password"
  //             }
  //           }
  //         }
  //     };
  //     const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  //     User.findOne.mockResolvedValue({
  //       user_id: '123',
  //       email: 'enduser@example.com',
  //       first_name: 'End',
  //       last_name: 'User',
  //       password_hash: await bcrypt.hash('password123', 10),
  //       role: 'End User',
  //     });
  //     generateToken.mockReturnValue('mock_token');

  //     await loginInfoForEndUser(mockRequest, mockResponse);

  //     expect(mockResponse.status).toHaveBeenCalledWith(200);
  //     expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ loyalty_end_user_login_rs: { status: 'success' } }));
  //   });

  //   it('should return error if wrong password', async () => {
  //     const mockRequest = {
  //       body: {
  //         loyalty_end_user_login_rq: {
  //           user_info: { email: 'enduser@example.com', password: 'wrongpassword' },
  //         },
  //       },
  //     };
  //     const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  //     User.findOne.mockResolvedValue({ password_hash: await bcrypt.hash('password123', 10), role: 'End User' });

  //     await loginInfoForEndUser(mockRequest, mockResponse);

  //     expect(mockResponse.status).toHaveBeenCalledWith(400);
  //     expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid password' });
  //   });
  // });

  //Fetch End User Info
  describe("Fetch End Users Info", () => {
    it("should fetch end users successfully", async () => {
      User.find.mockResolvedValue([]);

      const mockRequest = { query: { page: 1, limit: 10 } };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await fetchEndUsersInfo(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          loyalty_end_users_info_rs: { user_info_list: expect.any(Object) },
        })
      );
    });
  });
});

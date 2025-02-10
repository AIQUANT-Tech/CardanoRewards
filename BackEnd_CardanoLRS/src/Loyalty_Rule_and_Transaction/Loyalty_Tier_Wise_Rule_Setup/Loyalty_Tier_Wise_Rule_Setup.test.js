import { jest } from "@jest/globals";
import LoyaltyTierWiseRuleSetup from "./Loyalty_Tier_Wise_Rule_Setup_Schema.js";
import { saveTierwiseRuleSetup, fetchTierwiseRuleSetup } from "./Loyalty_Tier_Wise_Rule_Setup_Controller.js";
import LoyaltyTier from "../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema.js";

jest.mock("./Loyalty_Tier_Wise_Rule_Setup_Schema.js");
jest.mock("../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema.js");

describe("saveTierwiseRuleSetup", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should save tier-wise rules successfully", async () => {
    mockReq = {
      body: {
        loyalty_rule_setup_with_tier_rq: {
          header: {
            user_name: "businessUser",
            product: "LRS",
            request_type: "LOYALTY_RULE_SETUP_SAVE",
          },
          tier_wise_loyalty_rule_setup: {
            currency: "USD",
            tier_wise_loyalty_rule_list: [
              {
                tier_id: 1,
                rule_desc: "Revenue-based conversion for silver-tier members.",
                conversion_rules: [
                  { min_revenue: 1000, max_revenue: 5000, percentage_rate: 5 },
                ],
              },
            ],
          },
        },
      },
    };

    LoyaltyTierWiseRuleSetup.prototype.save = jest.fn().mockResolvedValue({});

    await saveTierwiseRuleSetup(mockReq, mockRes);

    expect(LoyaltyTierWiseRuleSetup.prototype.save).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      loyalty_rule_setup_with_tier_rs: { status: "success" },
    });
  });

  it("should return an error for invalid request type", async () => {
    mockReq = { body: { loyalty_rule_setup_with_tier_rq: { header: { request_type: "INVALID_REQUEST" } } } };

    await saveTierwiseRuleSetup(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid request type" });
  });

  it("should return an error if no tier-wise loyalty rule list is provided", async () => {
    mockReq = {
      body: {
        loyalty_rule_setup_with_tier_rq: {
          header: { request_type: "LOYALTY_RULE_SETUP_SAVE" },
          tier_wise_loyalty_rule_setup: { tier_wise_loyalty_rule_list: [] },
        },
      },
    };

    await saveTierwiseRuleSetup(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "No tier-wise loyalty rule list provided" });
  });

  it("should return an error if a tier has no conversion rules", async () => {
    mockReq = {
      body: {
        loyalty_rule_setup_with_tier_rq: {
          header: { request_type: "LOYALTY_RULE_SETUP_SAVE" },
          tier_wise_loyalty_rule_setup: {
            tier_wise_loyalty_rule_list: [{ tier_id: 1, rule_desc: "Test Rule", conversion_rules: [] }],
          },
        },
      },
    };

    await saveTierwiseRuleSetup(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "No conversion rules for tier 1" });
  });

  it("should handle database errors gracefully", async () => {
    mockReq = {
      body: {
        loyalty_rule_setup_with_tier_rq: {
          header: { request_type: "LOYALTY_RULE_SETUP_SAVE" },
          tier_wise_loyalty_rule_setup: {
            tier_wise_loyalty_rule_list: [
              {
                tier_id: 1,
                rule_desc: "Test Rule",
                conversion_rules: [{ min_revenue: 1000, max_revenue: 5000, percentage_rate: 5 }],
              },
            ],
          },
        },
      },
    };

    LoyaltyTierWiseRuleSetup.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));

    await saveTierwiseRuleSetup(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to save tier-wise rule setup." });
  });
});

describe("fetchTierwiseRuleSetup", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should fetch tier-wise rules successfully", async () => {
    mockReq = {
      body: {
        "loyalty_rule_setup_with_tier_rq": {
          "header": {
            "user_name": "endUser",
            "product": "LRS",
            "request_type": "FETCH_TIER_WISE_RULE_SETUP_INFO"
          }
        }
      }      
    };

    const mockRules = [
        {
            "tier_id": "10",
            "rule_desc": "Revenue-based conversion to ADA for Gold-tier members.",
            "conversion_rules": [
              {
                "min_revenue": "1001",
                "max_revenue": "5000",
                "percentage_rate": "8"
              }
            ]
      }
      ,{
    "loyalty_rule_setup_with_tier_rs": {
        "tier_wise_loyalty_rule_setup": {
            "currency": "USD",
            "wallet_balance": "8000",
            "tier_wise_loyalty_rule_list": [
                {
                    "tier_id": 10,
                    "tier_name": "Platinum",
                    "tier_desc": "Updated description nweeeeeeeee",
                    "rule_desc": "Rule's Description"
                }
            ]
        }
    }
}
    ];

    const mockTierData = { 
        "tier_id": 10,
        "tier_name": "Platinum",
        "tier_desc": "Updated description nweeeeeeeee",
        "rule_desc": "Rule's Description"
    };

    LoyaltyTierWiseRuleSetup.find.mockResolvedValue(mockRules);
    LoyaltyTier.findOne.mockResolvedValue(mockTierData);

    await fetchTierwiseRuleSetup(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
        "loyalty_rule_setup_with_tier_rs": {
            "tier_wise_loyalty_rule_setup": {
                "currency": "USD",
                "wallet_balance": "8000",
                "tier_wise_loyalty_rule_list": [
                    {
                        "tier_id": 10,
                        "tier_name": "Platinum",
                        "tier_desc": "Updated description nweeeeeeeee",
                        "rule_desc": "Rule's Description"
                    }
                ]
            }
        }
    });
  });

  it("should return an error for invalid request type", async () => {
    mockReq = { body: { loyalty_rule_setup_with_tier_rq: { header: { request_type: "INVALID_REQUEST" } } } };

    await fetchTierwiseRuleSetup(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid request type" });
  });

  it("should handle database errors gracefully", async () => {
    LoyaltyTierWiseRuleSetup.find.mockRejectedValue(new Error("Database error"));
    mockReq = { body: { loyalty_rule_setup_with_tier_rq: { header: { request_type: "FETCH_TIER_WISE_RULE_SETUP_INFO" } } } };

    await fetchTierwiseRuleSetup(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to fetch tier-wise rule setup." });
  });
});

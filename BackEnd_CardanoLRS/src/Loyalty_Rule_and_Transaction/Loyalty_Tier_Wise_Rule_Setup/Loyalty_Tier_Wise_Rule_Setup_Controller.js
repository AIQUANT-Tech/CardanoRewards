import LoyaltyTier from '../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema.js';
import LoyaltyRuleSetup from './Loyalty_Tier_Wise_Rule_Setup_Schema.js'; 

//Tire wise rule setup
export const saveTierwiseRuleSetup = async (req, res) => {
    try {
      const { loyalty_rule_setup_with_tier_rq } = req.body;
      const { user_name, product, request_type } = loyalty_rule_setup_with_tier_rq.header;
  
      if (request_type !== "LOYALTY_RULE_SETUP_SAVE") {
        return res.status(400).json({
          error: "Invalid request type"
        });
      }
  
      const { tier_wise_loyalty_rule_setup } = loyalty_rule_setup_with_tier_rq;
      const { tier_wise_loyalty_rule_list } = tier_wise_loyalty_rule_setup;
  
      if (!tier_wise_loyalty_rule_list || tier_wise_loyalty_rule_list.length === 0) {
        return res.status(400).json({
          error: "No tier-wise loyalty rule list provided"
        });
      }
  
      for (const rule of tier_wise_loyalty_rule_list) {
        const { tier_id, rule_desc, conversion_rules } = rule;
  
        if (!conversion_rules || conversion_rules.length === 0) {
          return res.status(400).json({
            error: `No conversion rules for tier ${tier_id}`
          });
        }
  
        for (const conversionRule of conversion_rules) {
          const { min_revenue, max_revenue, percentage_rate } = conversionRule;
  
          const newRule = new LoyaltyRuleSetup({
            tier_id,
            rule_desc: rule_desc,
            min_threshold: min_revenue,
            max_threshold: max_revenue || null, 
            percentage_rate,
            created_by: user_name,
            modified_by: user_name,
            modified_at: new Date(), 
            Status: 'A', 
          });
  
          await newRule.save();
        }
      }
  
      return res.status(200).json({
        loyalty_rule_setup_with_tier_rs: {
          status: "success"
        }
      });
  
    } catch (error) {
      console.error('Error saving tier-wise rule setup:', error);
      return res.status(500).json({
        error: "Failed to save tier-wise rule setup."
      });
    }
  };
  

  

//Fetch rule
export const fetchTierwiseRuleSetup = async (req, res) => {
  try {
    const { loyalty_rule_setup_with_tier_rq } = req.body;
    const { user_name, product, request_type } = loyalty_rule_setup_with_tier_rq.header;

    if (request_type !== "FETCH_TIER_WISE_RULE_SETUP_INFO") {
      return res.status(400).json({
        error: "Invalid request type"
      });
    }

    const tierWiseRuleSetup = await LoyaltyRuleSetup.find({});    

    if (!tierWiseRuleSetup) {
      return res.status(404).json({
        loyalty_rule_setup_with_tier_rs: {
          tier_wise_loyalty_rule_setup: {}
        }
      });
    }

    const tierWiseRules = [];

    for (const rule of tierWiseRuleSetup) {
        const tier = await LoyaltyTier.findOne({ tier_id: rule.tier_id, Status: 'A' });
        if (tier) {
            const updatedTierDesc = tier.tier_desc;
            tierWiseRules.push({
                tier_id: rule.tier_id,
                tier_name: tier.tier_name,  
                tier_desc: updatedTierDesc, 
                rule_desc: rule.rule_desc,
                conversion_rules: rule.conversion_rules
              });
            }
          }

    const response = {
      loyalty_rule_setup_with_tier_rs: {
        tier_wise_loyalty_rule_setup: {
          currency: "USD", 
          wallet_balance: "8000", 
          tier_wise_loyalty_rule_list: tierWiseRules
        }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching tier-wise rule setup:', error);
    res.status(500).json({
      error: "Failed to fetch tier-wise rule setup."
    });
  }
};
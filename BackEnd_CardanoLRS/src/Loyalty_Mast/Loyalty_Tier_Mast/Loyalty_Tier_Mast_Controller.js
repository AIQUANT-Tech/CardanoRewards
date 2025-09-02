import LoyaltyTier from './Loyalty_Tier_Mast_Schema.js';  

//Create tier
export const createLoyaltyTiers = async (req, res) => {
  try {
    const { loyalty_tier_crud_rq } = req.body;
    const { tier_list } = loyalty_tier_crud_rq;

    const loyaltyTiers = tier_list.map(async (tier) => {
      const newTier = new LoyaltyTier({
        tier_name: tier.tier_name,
        tier_desc: tier.tier_desc,
        created_by: loyalty_tier_crud_rq.header.user_name,
        modified_by: loyalty_tier_crud_rq.header.user_name, 
        modified_at: new Date(), 
        Status: tier.status === 'Active' ? 'A' : tier.status === 'Inactive' ? 'I' : 'D', 
      });
      
      await newTier.save();  
    });

    await Promise.all(loyaltyTiers);

    res.status(200).json({
      loyalty_tier_crud_rs: {
        status: 'success',
      },
    });
  } catch (error) {
    console.error('Error creating loyalty tiers:', error);
    res.status(500).json({
      loyalty_tier_crud_rs: {
        status: 'failure',
      },
    });
  }
};

//Edit tier
export const editLoyaltyTiers = async (req, res) => {
    try {
      const { loyalty_tier_crud_rq } = req.body;
      const { tier_list } = loyalty_tier_crud_rq;
  
      const editPromises = tier_list.map(async (tier) => {
        const { tier_id, tier_name, tier_desc, Status } = tier;
  
        const existingTier = await LoyaltyTier.findOne({ tier_id });
  
        if (existingTier) {
          existingTier.tier_name = tier_name;
          existingTier.tier_desc = tier_desc;
          existingTier.Status = Status === 'Active' ? 'A' : Status === 'Inactive' ? 'I' : existingTier.Status;
          existingTier.modified_by = loyalty_tier_crud_rq.header.user_name; 
          existingTier.modified_at = new Date(); 
  
          await existingTier.save();
        } else {
          throw new Error(`Tier with tier_id ${tier_id} not found`);
        }
      });
  
      await Promise.all(editPromises);
  
      res.status(200).json({
        loyalty_tier_crud_rs: {
          status: 'success',
        },
      });
    } catch (error) {
      console.error('Error editing loyalty tiers:', error);
      res.status(500).json({
        loyalty_tier_crud_rs: {
          status: 'failure',
        },
      });
    }
  };


  //Delete tier
  export const deleteLoyaltyTiers = async (req, res) => {
    try {
      const { loyalty_tier_crud_rq } = req.body;
      const { tier_list } = loyalty_tier_crud_rq;
  
      const deletePromises = tier_list.map(async (tier) => {
        const { tier_id } = tier;
  
        const existingTier = await LoyaltyTier.findOne({ tier_id });
  
        if (existingTier) {
            await LoyaltyTier.deleteOne({ tier_id });  
        } else {
          throw new Error(`Tier with tier_id ${tier_id} not found`);
        }
      });
  
      await Promise.all(deletePromises);
  
      res.status(200).json({
        loyalty_offer_crud_rs: {
          status: 'success',
        },
      });
    } catch (error) {
      console.error('Error deleting loyalty tiers:', error);
      res.status(500).json({
        loyalty_offer_crud_rs: {
          status: 'failure',
        },
      });
    }
  };
  
  //Get all tiers
  export const getLoyaltyTiersInfo = async (req, res) => {
    try {
      const { loyalty_tier_fetch_rq } = req.body;
  
      const tiers = await LoyaltyTier.find();
  
      const tierList = tiers.map(tier => ({
        tier_id: tier.tier_id,
        tier_name: tier.tier_name,
        tier_desc: tier.tier_desc,
        modified_by: tier.modified_by,
        last_modified: tier.modified_at.toLocaleString(), 
        status: tier.Status === 'A' ? 'Active' : tier.Status === 'I' ? 'Inactive' : 'Unknown', // Map the status
      }));
  
      res.status(200).json({
        loyalty_tier_fetch_rs: {
          tier_list: tierList,
        },
      });
    } catch (error) {
      console.error('Error fetching loyalty tiers:', error);
      res.status(500).json({
        loyalty_tier_fetch_rs: {
          status: 'failure',
        },
      });
    }
  };

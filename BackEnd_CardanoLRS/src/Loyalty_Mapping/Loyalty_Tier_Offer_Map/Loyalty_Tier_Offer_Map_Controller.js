import LoyaltyTierOfferMap from './Loyalty_Tier_Offer_Map_Schema.js';  
import LoyaltyTier from '../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema.js';  
import LoyaltyOffer from '../../Loyalty_Mast/Loyalty_Offer_Mast/Loyalty_Offer_Mast_Schema.js';  

//Map offers with tiers
export const mappingLoyaltyOffersTiers = async (req, res) => {
  try {
    const { loyalty_offer_tier_mapping_rq } = req.body;
    const { mapping_info_offer_tier } = loyalty_offer_tier_mapping_rq;

    const mappingPromises = mapping_info_offer_tier.map(async (mapping) => {
      const { offer_id, tier_id, Status } = mapping;

      const loyaltyTier = await LoyaltyTier.findOne({ tier_id });
      const loyaltyOffer = await LoyaltyOffer.findOne({ offer_id });

      if (!loyaltyTier) {
        throw new Error(`Loyalty Tier with tier_id ${tier_id} not found`);
      }
      if (!loyaltyOffer) {
        throw new Error(`Loyalty Offer with offer_id ${offer_id} not found`);
      }

      let existingMapping = await LoyaltyTierOfferMap.findOne({ tier_id, offer_id });

      console.log(existingMapping);
      

      if (existingMapping) {
        existingMapping.status = Status;
        existingMapping.modified_at = new Date();
        existingMapping.modified_by = loyalty_offer_tier_mapping_rq.header.user_name;
        await existingMapping.save();
      } else {
        const newMapping = new LoyaltyTierOfferMap({
          tier_id,
          offer_id,
          created_by: loyalty_offer_tier_mapping_rq.header.user_name,
          modified_by: loyalty_offer_tier_mapping_rq.header.user_name,
          modified_at: new Date(), 
          Status: Status,
        });
        await newMapping.save();
      }
    });

    await Promise.all(mappingPromises);

    res.status(200).json({
      loyalty_offer_tier_mapping_rs: {
        status: 'success',
      },
    });
  } catch (error) {
    console.error('Error mapping loyalty offers and tiers:', error);
    res.status(500).json({
      loyalty_offer_tier_mapping_rs: {
        status: 'failure',
      },
    });
  }
};

//Edit existing map with offer and tiers
export const editMappingLoyaltyOffersTiers = async (req, res) => {
    try {
      const { edit_loyalty_offer_tier_mapping_rq } = req.body;
      const { mapping_info_offer_tier } = edit_loyalty_offer_tier_mapping_rq;
  
      const validStatusValues = ['A', 'I'];
  
      const updatePromises = mapping_info_offer_tier.map(async (mapping) => {
        const { mapping_id, offer_id, tier_id, Status } = mapping;
  
        if (!validStatusValues.includes(Status)) {
          throw new Error(`Invalid status value provided: ${Status}`);
        }
  
        if (mapping_id) {
          const existingMapping = await LoyaltyTierOfferMap.findOne({ mapping_id });
          
          if (!existingMapping) {
            throw new Error(`Mapping with mapping_id ${mapping_id} not found`);
          }
  
          existingMapping.status = 'I';  
          existingMapping.modified_at = new Date();
          existingMapping.modified_by = edit_loyalty_offer_tier_mapping_rq.header.user_name;
  
          await existingMapping.save();
        }
  
        if (offer_id && tier_id) {
          const newMapping = new LoyaltyTierOfferMap({
            offer_id,
            tier_id,
            Status: Status,  
            created_by: edit_loyalty_offer_tier_mapping_rq.header.user_name,
            modified_by: edit_loyalty_offer_tier_mapping_rq.header.user_name,
            created_at: new Date(),
            modified_at: new Date(),
          });
  
          await newMapping.save();
        }
      });
  
      await Promise.all(updatePromises);
  
      res.status(200).json({
        edit_loyalty_offer_tier_mapping_rs: {
          status: 'success',
        },
      });
    } catch (error) {
      console.error('Error editing loyalty offer tier mappings:', error);
      res.status(500).json({
        edit_loyalty_offer_tier_mapping_rs: {
          status: 'failure',
          error: error.message,
        },
      });
    }
  };

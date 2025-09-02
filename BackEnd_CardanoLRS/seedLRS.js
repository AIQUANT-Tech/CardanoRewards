// seedLRS.js
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

import User from "./src/Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema.js";
import LoyaltyTier from "./src/Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema.js";
import LoyaltyOffer from "./src/Loyalty_Mast/Loyalty_Offer_Mast/Loyalty_Offer_Mast_Schema.js";
import LoyaltyTierOfferMap from "./src/Loyalty_Mapping/Loyalty_Tier_Offer_Map/Loyalty_Tier_Offer_Map_Schema.js";
import LoyaltyEndUserTierMap from "./src/Loyalty_Mapping/Loyalty_Enduser_Tier_Map/Loyalty_Enduser_Tier_Map_Schema.js";
import LoyaltyTierWiseRuleSetup from "./src/Loyalty_Rule_and_Transaction/Loyalty_Tier_Wise_Rule_Setup/Loyalty_Tier_Wise_Rule_Setup_Schema.js";

// ====== MongoDB Connection ======
const MONGO_URI = "mongodb://localhost:27017/LRS"; // change if needed

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected...");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

// ====== Seeder ======
async function seed() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await LoyaltyTier.deleteMany({});
    await LoyaltyOffer.deleteMany({});
    await LoyaltyTierOfferMap.deleteMany({});
    await LoyaltyEndUserTierMap.deleteMany({});
    await LoyaltyTierWiseRuleSetup.deleteMany({});

    console.log("🧹 Cleared old data...");

    // ====== 1. Seed Users ======
    const users = [];
    for (let i = 0; i < 2000; i++) {
      users.push({
        email: faker.internet.email(),
        password_hash: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        wallet_address: faker.finance.ethereumAddress(),
        role: faker.helpers.arrayElement(["End User", "Business User"]),
        created_at: faker.date.past(),
        last_login: faker.date.recent(),
        Status: true,
      });
    }
    const userDocs = await User.insertMany(users);
    console.log(`👤 Inserted ${userDocs.length} Users`);

    // ====== 2. Seed Loyalty Tiers ======
    const tiers = [];
    for (let i = 0; i < 20; i++) {
      tiers.push({
        tier_name: `Tier-${i + 1}`,
        tier_desc: faker.lorem.sentence(),
        created_at: faker.date.past(),
        modified_at: faker.date.recent(),
        created_by: faker.person.firstName(),
        modified_by: faker.person.firstName(),
        Status: faker.helpers.arrayElement(["A", "I", "D"]),
      });
    }
    const tierDocs = await LoyaltyTier.insertMany(tiers);
    console.log(`⭐ Inserted ${tierDocs.length} Tiers`);

    // ====== 3. Seed Loyalty Offers ======
    const offers = [];
    for (let i = 0; i < 50; i++) {
      offers.push({
        offer_name: faker.commerce.productName(),
        offer_desc: faker.commerce.productDescription(),
        created_at: faker.date.past(),
        modified_at: faker.date.recent(),
        created_by: faker.person.firstName(),
        modified_by: faker.person.firstName(),
        status: faker.helpers.arrayElement(["A", "I", "D"]),
      });
    }
    const offerDocs = await LoyaltyOffer.insertMany(offers);
    console.log(`🎁 Inserted ${offerDocs.length} Offers`);

    // ====== 4. Seed Tier-Offer Maps ======
    const tierOfferMaps = [];
    for (let i = 0; i < 2000; i++) {
      tierOfferMaps.push({
        tier_id: faker.helpers.arrayElement(tierDocs).tier_id,
        offer_id: faker.helpers.arrayElement(offerDocs).offer_id,
        created_at: faker.date.past(),
        modified_at: faker.date.recent(),
        created_by: faker.person.firstName(),
        modified_by: faker.person.firstName(),
        Status: faker.helpers.arrayElement(["A", "I"]),
      });
    }
    await LoyaltyTierOfferMap.insertMany(tierOfferMaps);
    console.log(`🔗 Inserted ${tierOfferMaps.length} Tier-Offer Mappings`);

    // ====== 5. Seed Tier Rule Setups ======
    const rules = [];
    for (let i = 0; i < 500; i++) {
      rules.push({
        tier_id: faker.helpers.arrayElement(tierDocs).tier_id,
        rule_desc: faker.lorem.sentence(),
        min_threshold: faker.number.int({ min: 100, max: 1000 }),
        max_threshold: faker.number.int({ min: 2000, max: 5000 }),
        percentage_rate: faker.number.int({ min: 1, max: 20 }),
        created_at: faker.date.past(),
        modified_at: faker.date.recent(),
        created_by: faker.person.firstName(),
        modified_by: faker.person.firstName(),
        Status: faker.helpers.arrayElement(["A", "I"]),
      });
    }
    await LoyaltyTierWiseRuleSetup.insertMany(rules);
    console.log(`📏 Inserted ${rules.length} Tier Rules`);

    // ====== 6. Seed EndUser-Tier Mappings ======
    const endUserTierMaps = [];
    for (let i = 0; i < 5500; i++) {
      endUserTierMaps.push({
        tier_id: faker.helpers.arrayElement(tierDocs).tier_id,
        user_id: faker.helpers.arrayElement(userDocs).user_id,
        created_at: faker.date.past(),
        modified_at: faker.date.recent(),
        created_by: faker.person.firstName(),
        modified_by: faker.person.firstName(),
        last_tier_assigned_at: faker.date.recent(),
        status: faker.helpers.arrayElement(["A", "I"]),
      });
    }
    await LoyaltyEndUserTierMap.insertMany(endUserTierMaps);
    console.log(`🧑‍🤝‍🧑 Inserted ${endUserTierMaps.length} EndUser-Tier Mappings`);

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
}

seed();

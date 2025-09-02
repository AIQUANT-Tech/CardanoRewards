import LoyaltyOffer from "./Loyalty_Offer_Mast_Schema.js";

//Create offers
export const createLoyaltyOffers = async (req, res) => {
  try {
    const { loyalty_offer_crud_rq } = req.body;

    if (!loyalty_offer_crud_rq || !loyalty_offer_crud_rq.offer_list) {
      return res.status(400).json({
        loyalty_offer_crud_rs: {
          status: "error",
          message: "Invalid request payload.",
        },
      });
    }

    const offers = loyalty_offer_crud_rq.offer_list.map((offer) => ({
      offer_name: offer.offer_name,
      offer_desc: offer.offer_desc,
      status: offer.status === "Active" ? "A" : "I",
      created_at: new Date(),
      modified_at: new Date(),
      created_by: loyalty_offer_crud_rq.header.user_name,
      modified_by: loyalty_offer_crud_rq.header.user_name,
    }));

    for (const offer of offers) {
      const newOffer = new LoyaltyOffer(offer);
      await newOffer.save();
    }

    res.status(201).json({
      loyalty_offer_crud_rs: {
        status: "success",
      },
    });
  } catch (error) {
    console.error("Error creating loyalty offers:", error);
    res.status(500).json({
      loyalty_offer_crud_rs: {
        status: "error",
        message: "Internal server error.",
      },
    });
  }
};

//Edit offers
export const editLoyaltyOffers = async (req, res) => {
  try {
    const { loyalty_offer_crud_rq } = req.body;

    if (
      !loyalty_offer_crud_rq ||
      !loyalty_offer_crud_rq.offer_list ||
      loyalty_offer_crud_rq.offer_list?.length === 0
    ) {
      return res.status(400).json({
        loyalty_offer_crud_rs: {
          status: "error",
          message: "Invalid request payload, offer_list is missing or empty.",
        },
      });
    }

    const { user_name } = loyalty_offer_crud_rq.header;
    const offersToUpdate = loyalty_offer_crud_rq.offer_list;

    for (const offer of offersToUpdate) {
      const { offer_id, offer_name, offer_desc, status } = offer;

      if (!offer_id || !offer_name || !offer_desc || !status) {
        return res.status(400).json({
          loyalty_offer_crud_rs: {
            status: "error",
            message: `Missing fields in offer with offer_id: ${offer_id}`,
          },
        });
      }

      const updatedOffer = await LoyaltyOffer.findOneAndUpdate(
        { offer_id: offer_id },
        {
          offer_name: offer_name,
          offer_desc: offer_desc,
          status: status === "Active" ? "A" : "I",
          modified_at: new Date(),
          modified_by: user_name,
        },
        { new: true }
      );

      if (!updatedOffer) {
        return res.status(404).json({
          loyalty_offer_crud_rs: {
            status: "error",
            message: `Offer with offer_id: ${offer_id} not found.`,
          },
        });
      }
    }

    res.status(200).json({
      loyalty_offer_crud_rs: {
        status: "success",
      },
    });
  } catch (error) {
    console.error("Error editing loyalty offers:", error);
    res.status(500).json({
      loyalty_offer_crud_rs: {
        status: "error",
        message: "Internal server error.",
      },
    });
  }
};

//Delete offers
export const deleteLoyaltyOffers = async (req, res) => {
  try {
    const { loyalty_offer_crud_rq } = req.body;

    // Validate if the request payload contains offer_list
    if (
      !loyalty_offer_crud_rq ||
      !loyalty_offer_crud_rq.offer_list ||
      loyalty_offer_crud_rq.offer_list.length === 0
    ) {
      return res.status(400).json({
        loyalty_offer_crud_rs: {
          status: "error",
          message: "Invalid request payload, offer_list is missing or empty.",
        },
      });
    }

    const { user_name } = loyalty_offer_crud_rq.header;
    const offersToDelete = loyalty_offer_crud_rq.offer_list;

    for (const offer of offersToDelete) {
      const { offer_id } = offer;

      if (!offer_id) {
        return res.status(400).json({
          loyalty_offer_crud_rs: {
            status: "error",
            message: "offer_id is missing in the offer.",
          },
        });
      }

      const deletedOffer = await LoyaltyOffer.findOneAndDelete({ offer_id });

      if (!deletedOffer) {
        return res.status(404).json({
          loyalty_offer_crud_rs: {
            status: "error",
            message: `Offer with offer_id: ${offer_id} not found.`,
          },
        });
      }
    }

    res.status(200).json({
      loyalty_offer_crud_rs: {
        status: "success",
      },
    });
  } catch (error) {
    console.error("Error deleting loyalty offers:", error);
    res.status(500).json({
      loyalty_offer_crud_rs: {
        status: "error",
        message: "Internal server error.",
      },
    });
  }
};

//Fetch offers
export const getLoyaltyOfferInfo = async (req, res) => {
  try {
    const { loyalty_offer_fetch_rq } = req.body;

    if (!loyalty_offer_fetch_rq || !loyalty_offer_fetch_rq.header) {
      return res.status(400).json({
        loyalty_offer_fetch_rs: {
          status: "error",
          message: "Invalid request payload.",
        },
      });
    }

    const { user_name } = loyalty_offer_fetch_rq.header;

    const offers = await LoyaltyOffer.find({});

    if (!offers || offers.length === 0) {
      return res.status(404).json({
        loyalty_offer_fetch_rs: {
          status: "error",
          message: "No loyalty offers found.",
        },
      });
    }

    const offerList = offers.map((offer) => ({
      offer_id: offer.offer_id.toString(),
      offer_name: offer.offer_name,
      offer_desc: offer.offer_desc,
      modified_by: offer.modified_by,
      last_modified: offer.modified_at.toLocaleString(),
      status: offer.status === "A" ? "Active" : "Inactive",
    }));

    res.status(200).json({
      loyalty_offer_fetch_rs: {
        offer_list: offerList,
      },
    });
  } catch (error) {
    console.error("Error fetching loyalty offers:", error);
    res.status(500).json({
      loyalty_offer_fetch_rs: {
        status: "error",
        message: "Internal server error.",
      },
    });
  }
};

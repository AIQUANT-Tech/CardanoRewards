import LoyaltyUserWalletTransaction from "./Loyalty_User_Wallet_Transaction_Schema.js";

export const getTransactionsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    const transactions = await LoyaltyUserWalletTransaction.find({
      user_id,
    }).sort({ transaction_date: -1 });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found for this user",
      });
    }

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

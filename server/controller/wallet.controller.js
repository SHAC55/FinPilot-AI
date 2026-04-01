import Transaction from "../models/transaction.model.js";
import Wallet from "../models/wallet.model.js";

//  Create Wallet
export const createWallet = async (req, res) => {
  try {
    const { name, type, balance, limit, notes } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Name and type are required",
      });
    }

    const existingWallet = await Wallet.findOne({
      user: req.user._id,
      name: name.trim().toLowerCase(),
    });

    if (existingWallet) {
      return res.status(400).json({
        success: false,
        message: "Wallet with this name already exists",
      });
    }

     if (balance < 0 || limit < 0) {
      return res.status(400).json({
        success: false,
        message: "Balance and limit must be positive",
      });
    }



    const wallet = await Wallet.create({
      user: req.user._id,
      name,
      type,
      balance: 0,
      limit,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Wallet created successfully",
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  Get All Wallets (User-wise)
export const getWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      wallets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  Get Single Wallet
export const getWalletById = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    res.status(200).json({
      success: true,
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  Update Wallet
export const updateWallet = async (req, res) => {
  try {
    const { limit } = req.body;

    //  Only allow limit update
    if (limit === undefined) {
      return res.status(400).json({
        success: false,
        message: "Only limit can be updated",
      });
    }

    if (limit < 0) {
      return res.status(400).json({
        success: false,
        message: "Limit must be positive",
      });
    }

    const wallet = await Wallet.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { limit }, 
      { new: true, runValidators: true }
    );

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wallet limit updated successfully",
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  Delete Wallet
export const deleteWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wallet deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Transactions by Wallet
export const getTransactionsByWallet = async (req, res) => {
  try {
    const walletId = req.params.id; 

    const transactions = await Transaction.find({
  userId: req.user._id, 
  wallet: walletId,
}).sort({ date: -1 });

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
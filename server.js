// server.js

const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://crypto-mining-ad151.firebaseio.com",
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Constants
const PLATFORM_WALLET = "0x09d9dfA5Dc0CCD94356DE335EF2c3bf2daF64e77";
const PAYOUT_THRESHOLD = 30; // USD

// Route: Check Mining Status
app.get("/api/status", (req, res) => {
  res.json({ message: "Server is running and ready to accept mining requests." });
});

// Route: Start Mining
app.post("/api/start", async (req, res) => {
  const { walletAddress, cryptoType, miningMode } = req.body;

  if (!walletAddress || walletAddress.length < 10) {
    return res.status(400).json({ error: "Invalid wallet address." });
  }

  try {
    const sessionRef = db.collection("mining-sessions").doc(walletAddress);
    await sessionRef.set({
      walletAddress,
      cryptoType,
      miningMode,
      status: "active",
      startTime: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ message: "Mining started successfully.", walletAddress, cryptoType });
  } catch (error) {
    res.status(500).json({ error: "Failed to start mining session.", details: error.message });
  }
});

// Route: Stop Mining
app.post("/api/stop", async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress || walletAddress.length < 10) {
    return res.status(400).json({ error: "Invalid wallet address." });
  }

  try {
    const sessionRef = db.collection("mining-sessions").doc(walletAddress);
    await sessionRef.update({
      status: "inactive",
      endTime: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ message: "Mining session stopped.", walletAddress });
  } catch (error) {
    res.status(500).json({ error: "Failed to stop mining session.", details: error.message });
  }
});

// Route: Check Earnings and Handle Payouts
app.get("/api/earnings/:walletAddress", async (req, res) => {
  const { walletAddress } = req.params;

  try {
    const earningsSnapshot = await db.collection("earnings").doc(walletAddress).get();

    if (!earningsSnapshot.exists) {
      return res.json({ message: "No earnings found for this wallet.", totalEarnings: 0 });
    }

    const earningsData = earningsSnapshot.data();
    const totalEarnings = earningsData.total || 0;

    if (totalEarnings >= PAYOUT_THRESHOLD) {
      const platformFee = totalEarnings * 0.01;
      const userPayout = totalEarnings - platformFee;

      // Add payout logic here (e.g., interact with blockchain API)
      res.json({
        message: `Payout initiated for wallet: ${walletAddress}`,
        totalEarnings,
        platformFee,
        userPayout,
        status: "Payout Successful",
      });

      // Reset earnings after payout
      await db.collection("earnings").doc(walletAddress).update({ total: 0 });
    } else {
      res.json({
        message: "Earnings below the payout threshold.",
        totalEarnings,
        threshold: PAYOUT_THRESHOLD,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve earnings.", details: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

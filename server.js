const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Store the platform's wallet address
const PLATFORM_WALLET = "0x09d9dfA5Dc0CCD94356DE335EF2c3bf2daF64e77";

// Routes
app.post('/start-mining', async (req, res) => {
    const { walletAddress, cryptoType } = req.body;

    if (!walletAddress || !cryptoType) {
        return res.status(400).json({ error: "Wallet address and cryptocurrency type are required." });
    }

    // Validate wallet address format
    const ethRegex = /^(0x[a-fA-F0-9]{40})$/;
    const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    if (cryptoType === "eth" && !ethRegex.test(walletAddress)) {
        return res.status(400).json({ error: "Invalid Ethereum wallet address." });
    }
    if (cryptoType === "btc" && !btcRegex.test(walletAddress)) {
        return res.status(400).json({ error: "Invalid Bitcoin wallet address." });
    }

    // Initiate mining API request (example endpoint)
    try {
        const response = await axios.post('https://example-mining-api.com/start', {
            wallet: walletAddress,
            type: cryptoType,
            feeWallet: PLATFORM_WALLET,
            feePercent: 1
        });
        res.json({ message: "Mining started successfully.", data: response.data });
    } catch (error) {
        res.status(500).json({ error: "Error starting mining process." });
    }
});

app.post('/stop-mining', (req, res) => {
    // Example: Stop mining API call
    res.json({ message: "Mining stopped successfully." });
});

// Server initialization
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

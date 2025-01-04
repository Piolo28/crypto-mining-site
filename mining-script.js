// mining-script.js

let miningStatus = false;
let totalMined = 0;
const platformWallet = "0x09d9dfA5Dc0CCD94356DE335EF2c3bf2daF64e77";

function requestConsent() {
    if (validateWalletAddress(document.getElementById("wallet-address").value)) {
        const miningMode = document.getElementById("mining-mode").value;
        const cryptoType = document.getElementById("crypto-type").value;

        startMining(miningMode, cryptoType);
    } else {
        alert("Please enter a valid wallet address.");
    }
}

function startMining(mode, crypto) {
    if (miningStatus) {
        alert("Mining is already running!");
        return;
    }

    miningStatus = true;
    document.getElementById("mining-status").innerText = `Status: Mining ${crypto.toUpperCase()} (${mode.toUpperCase()} Mode)`;

    // Simulate mining
    const miningInterval = setInterval(() => {
        if (!miningStatus) {
            clearInterval(miningInterval);
            return;
        }

        const minedAmount = simulateMining(mode, crypto);
        const fee = minedAmount * 0.01;
        const netEarnings = minedAmount - fee;

        totalMined += netEarnings;
        updateDashboard(netEarnings);

        console.log(`Mined ${crypto.toUpperCase()}: ${minedAmount.toFixed(6)}, Fee: ${fee.toFixed(6)}`);
        sendFeeToPlatform(fee, crypto);
    }, 3000);
}

function stopMining() {
    if (!miningStatus) {
        alert("No mining is currently running.");
        return;
    }

    miningStatus = false;
    document.getElementById("mining-status").innerText = "Status: Not Mining";
    alert("Mining has been stopped.");
}

function simulateMining(mode, crypto) {
    const baseRate = mode === "cpu" ? 0.001 : 0.005; // Adjust based on mode
    const cryptoMultiplier = crypto === "btc" ? 1 : crypto === "eth" ? 0.9 : 0.8; // Example multipliers
    return baseRate * cryptoMultiplier;
}

function updateDashboard(earnings) {
    document.getElementById("total-mined").innerText = totalMined.toFixed(6);
    document.getElementById("estimated-earnings").innerText = `$${(totalMined * 50).toFixed(2)}`; // Example conversion rate
}

function validateWalletAddress(wallet) {
    const ethRegex = /^0x[a-fA-F0-9]{40}$/;
    const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;

    if (ethRegex.test(wallet) || btcRegex.test(wallet)) {
        console.log("Valid wallet address.");
        return true;
    }

    console.error("Invalid wallet address.");
    return false;
}

function sendFeeToPlatform(fee, crypto) {
    console.log(`Sending fee of ${fee.toFixed(6)} ${crypto.toUpperCase()} to platform wallet: ${platformWallet}`);
    // Placeholder for actual transaction logic
}

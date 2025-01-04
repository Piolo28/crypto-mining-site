let mining = false;
let totalMined = 0;
let userWallet = '';
const platformWallet = 'YOUR_PLATFORM_WALLET_ADDRESS'; // Replace with your wallet address

document.getElementById('wallet-address').addEventListener('input', function (e) {
    userWallet = e.target.value;
});

// Simulated mining function (to be replaced with actual mining library)
function startMining() {
    const mode = document.getElementById('mining-mode').value;
    if (!userWallet) {
        alert('Please enter a valid wallet address.');
        return;
    }

    mining = true;
    document.getElementById('mining-status').textContent = `Status: Mining (${mode.toUpperCase()})`;
    console.log(`Mining started in ${mode} mode. Mining rewards will be shared: 99% to ${userWallet}, 1% to ${platformWallet}.`);

    // Mining logic (e.g., using a library like WebMiner)
    mine(mode);
}

function stopMining() {
    mining = false;
    document.getElementById('mining-status').textContent = 'Status: Not Mining';
    console.log('Mining stopped.');
}

function mine(mode) {
    if (!mining) return;

    // Simulate mining
    setTimeout(() => {
        const minedAmount = Math.random() * 0.01; // Example amount
        const platformFee = minedAmount * 0.01;
        const userReward = minedAmount - platformFee;

        totalMined += userReward;

        // Update dashboard
        document.getElementById('total-mined').textContent = totalMined.toFixed(6);
        document.getElementById('estimated-earnings').textContent = `$${(totalMined * 50000).toFixed(2)}`; // Assume 1 coin = $50,000

        console.log(`Mined: ${minedAmount.toFixed(6)} coins. User: ${userReward.toFixed(6)}, Platform: ${platformFee.toFixed(6)}.`);

        // Continue mining if active
        if (mining) mine(mode);
    }, 1000); // Mining interval (1 second)
}

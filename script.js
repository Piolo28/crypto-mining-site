let currentBalance = 0.0;
const threshold = 0.001; // Equivalent to $30 (example rate)

function startMining() {
    const walletAddress = document.getElementById('user-wallet').value;
    if (!walletAddress) {
        alert('Please enter your BTC wallet address to start mining.');
        return;
    }
    document.getElementById('mining-status').innerText = `Mining started for wallet: ${walletAddress}`;
    simulateMining();
}

function stopMining() {
    document.getElementById('mining-status').innerText = 'Mining stopped';
}

function simulateMining() {
    const miningInterval = setInterval(() => {
        if (document.getElementById('mining-status').innerText === 'Mining stopped') {
            clearInterval(miningInterval);
            return;
        }
        updateBalance(0.00001); // Example increment
    }, 1000);
}

function updateBalance(amount) {
    currentBalance += amount;
    document.getElementById('current-balance').innerText = currentBalance.toFixed(8);
    checkThreshold();
}

function checkThreshold() {
    const withdrawButton = document.getElementById('withdraw-button');
    withdrawButton.disabled = currentBalance < threshold;
}

function withdrawEarnings() {
    const walletAddress = document.getElementById('user-wallet').value;
    if (!walletAddress) {
        alert('Please enter your BTC wallet address to withdraw.');
        return;
    }

    alert(`Withdrawing ${currentBalance.toFixed(8)} BTC to wallet: ${walletAddress}`);
    currentBalance = 0.0;
    updateBalance(0);
}

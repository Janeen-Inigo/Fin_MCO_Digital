
let walletAddress = "0x630f8F0bD1207943a1AF963aE0FBBEe52FBC7d6B";

const connectButton = document.getElementById("connectWalletButton");
const walletStatus = document.getElementById("walletStatus");
const message = document.getElementById("message");

connectButton.addEventListener("click", connectWallet);

async function connectWallet() {
    try {
        if (!window.ethereum) {
            message.innerText = "Please install MetaMask.";
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        walletAddress = await provider.getSigner().getAddress();

        walletStatus.innerText =
            "Connected: " + walletAddress.slice(0, 6) +
            "..." + walletAddress.slice(-4);

        message.innerText = "Wallet connected successfully.";

    } catch (error) {
        message.innerText = "Wallet connection failed.";
    }
}

document.getElementById("registerButton").addEventListener("click", registerVoter);
document.getElementById("loginButton").addEventListener("click", loginVoter);

function registerVoter() {
    if (!walletAddress) {
        alert("Please connect your MetaMask wallet first.");
        return;
    }

    const fullName = document.getElementById("fullName").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!fullName || !studentId || !email) {
        alert("Please complete all registration fields.");
        return;
    }

    const voter = {
        fullName: fullName,
        studentId: studentId,
        email: email,
        wallet: walletAddress
    };

    localStorage.setItem(
        "campusVoter_" + walletAddress.toLowerCase(),
        JSON.stringify(voter)
    );

    message.innerText = "Registration successful. You can now login.";
}

function loginVoter() {
    if (!walletAddress) {
        alert("Please connect your MetaMask wallet first.");
        return;
    }

    const studentId = document.getElementById("loginStudentId").value.trim();

    const savedVoter = localStorage.getItem(
        "campusVoter_" + walletAddress.toLowerCase()
    );

    if (!savedVoter) {
        message.innerText = "No registered account found for this wallet.";
        return;
    }

    const voter = JSON.parse(savedVoter);

    if (voter.studentId !== studentId) {
        message.innerText = "Incorrect Student ID.";
        return;
    }

    localStorage.setItem("campusVoterSession", JSON.stringify(voter));

    message.innerText = "Login successful. Redirecting...";

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
}

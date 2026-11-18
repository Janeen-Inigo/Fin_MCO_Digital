
const contractAddress = "0x630f8F0bD1207943a1AF963aE0FBBEe52FBC7d6B";

const contractABI = [
    "function getCandidate(uint256 candidateId) view returns (uint256 id, string name, string position, uint256 voteCount, bool exists)",
    "function getCandidateCount() view returns (uint256)",
    "function getTotalVotes() view returns (uint256)",
    "function getElectionStatus() view returns (bool)"
];

const provider = new ethers.providers.JsonRpcProvider(
    "https://ethereum-sepolia-rpc.publicnode.com"
);

const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
);

async function loadResults() {
    const resultsList = document.getElementById("resultsList");

    try {
        resultsList.innerHTML = "Loading results...";

        const isOpen = await contract.getElectionStatus();
        const count = await contract.getCandidateCount();
        const total = await contract.getTotalVotes();

        document.getElementById("resultStatus").innerText =
            isOpen ? "Election is OPEN" : "Election is CLOSED";

        document.getElementById("resultTotal").innerText =
            "Total votes: " + total.toString();

        resultsList.innerHTML = "";

        for (let i = 1; i <= count.toNumber(); i++) {
            const candidate = await contract.getCandidate(i);

            const div = document.createElement("div");
            div.className = "candidate";

            const name = document.createElement("h3");
            name.innerText = candidate.name;

            const position = document.createElement("p");
            position.innerText = "Position: " + candidate.position;

            const votes = document.createElement("p");
            votes.innerText = "Votes: " + candidate.voteCount.toString();

            div.appendChild(name);
            div.appendChild(position);
            div.appendChild(votes);

            resultsList.appendChild(div);
        }

        if (count.toNumber() === 0) {
            resultsList.innerText = "No candidates available yet.";
        }

    } catch (error) {
        resultsList.innerText =
            "Unable to load results. Check the contract address and network.";
        console.error(error);
    }
}

loadResults();

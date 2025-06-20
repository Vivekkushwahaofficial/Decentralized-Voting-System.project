/**
 * Decentralized Voting System - JavaScript Frontend Interface
 * This file provides a complete interface for interacting with the Project.sol smart contract
 */

// Web3 and Contract Configuration
let web3;
let contract;
let userAccount;

// Contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "string", "name": "_electionName", "type": "string"}],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "candidateId", "type": "uint256"},
            {"indexed": false, "internalType": "string", "name": "name", "type": "string"}
        ],
        "name": "CandidateAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "voter", "type": "address"},
            {"indexed": true, "internalType": "uint256", "name": "candidateId", "type": "uint256"}
        ],
        "name": "VoteCast",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "voter", "type": "address"}
        ],
        "name": "VoterRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "VotingStarted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "VotingEnded",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_candidateId", "type": "uint256"}],
        "name": "castVote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_candidateId", "type": "uint256"}],
        "name": "getCandidate",
        "outputs": [
            {"internalType": "uint256", "name": "id", "type": "uint256"},
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "uint256", "name": "voteCount", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getElectionStatus",
        "outputs": [
            {"internalType": "bool", "name": "_votingStarted", "type": "bool"},
            {"internalType": "bool", "name": "_votingEnded", "type": "bool"},
            {"internalType": "uint256", "name": "_totalVotes", "type": "uint256"},
            {"internalType": "uint256", "name": "_candidateCount", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getResults",
        "outputs": [
            {"internalType": "string", "name": "winnerName", "type": "string"},
            {"internalType": "uint256", "name": "winnerVotes", "type": "uint256"},
            {"internalType": "uint256", "name": "totalVotesCast", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_voter", "type": "address"}],
        "name": "getVoter",
        "outputs": [
            {"internalType": "bool", "name": "isRegistered", "type": "bool"},
            {"internalType": "bool", "name": "hasVoted", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_name", "type": "string"}],
        "name": "registerCandidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_voter", "type": "address"}],
        "name": "registerVoter",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "startVoting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "endVoting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Contract address (to be set after deployment)
let CONTRACT_ADDRESS = "0x..."; // Replace with actual deployed contract address

/**
 * Initialize Web3 connection and contract instance
 */
async function initWeb3() {
    try {
        // Check if Web3 is injected (MetaMask, etc.)
        if (typeof window.ethereum !== 'undefined') {
            web3 = new Web3(window.ethereum);
            
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            userAccount = accounts[0];
            console.log('Connected account:', userAccount);
            
            // Initialize contract
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            
            // Listen for account changes
            window.ethereum.o
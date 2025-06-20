// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Crowdfunding {
    address public owner;
    uint public campaignCount = 0;

    struct Campaign {
        address payable creator;
        string title;
        string description;
        uint goal;
        uint deadline;
        uint amountCollected;
        bool goalReached;
        mapping(address => uint) donations;
    }

    mapping(uint => Campaign) public campaigns;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        uint _goal,
        uint _durationInDays
    ) public {
        Campaign storage c = campaigns[campaignCount];
        c.creator = payable(msg.sender);
        c.title = _title;
        c.description = _description;
        c.goal = _goal;
        c.deadline = block.timestamp + (_durationInDays * 1 days);
        campaignCount++;
    }

    function donateToCampaign(uint _id) public payable {
        Campaign storage c = campaigns[_id];
        require(block.timestamp < c.deadline, "Campaign ended");
        require(msg.value > 0, "Donation must be > 0");

        c.amountCollected += msg.value;
        c.donations[msg.sender] += msg.value;
    }

    function withdrawFunds(uint _id) public {
        Campaign storage c = campaigns[_id];
        require(msg.sender == c.creator, "Not campaign creator");
        require(block.timestamp >= c.deadline, "Campaign not ended");
        require(c.amountCollected >= c.goal, "Goal not reached");

        c.goalReached = true;
        c.creator.transfer(c.amountCollected);
    }

    function getCampaign(uint _id)
        public
        view
        returns (
            address,
            string memory,
            string memory,
            uint,
            uint,
            uint,
            bool
        )
    {
        Campaign storage c = campaigns[_id];
        return (
            c.creator,
            c.title,
            c.description,
            c.goal,
            c.deadline,
            c.amountCollected,
            c.goalReached
        );
    }
}


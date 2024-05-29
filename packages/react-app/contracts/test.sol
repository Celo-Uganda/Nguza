pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LendingPlatform {
    struct User {
        uint256 stakedAmount;
        uint256 creditScore;
        uint256 loanAmount;
        uint256 loanRepaymentDeadline;
        bool hasActiveLoan;
    }

    mapping(address => User) public users;
    mapping(address => uint256) public rewards;

    IERC20 public celoToken;
    uint256 public dailyRewardRate = 3; // 0.3% daily
    uint256 public loanToValueRatio = 60; // 60%

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event LoanRequested(address indexed user, uint256 amount);
    event LoanRepaid(address indexed user, uint256 amount);
    event Default(address indexed user, uint256 amount);

    constructor(address _celoToken) {
        celoToken = IERC20(_celoToken);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(celoToken.transferFrom(msg.sender, address(this), amount), "Failed to transfer CEL");
        
        User storage user = users[msg.sender];
        user.stakedAmount += amount;
        emit Staked(msg.sender, amount);
    }

    function withdrawStake(uint256 amount) external {
        User storage user = users[msg.sender];
        require(amount > 0 && amount <= user.stakedAmount, "Invalid amount");

        user.stakedAmount -= amount;
        require(celoToken.transfer(msg.sender, amount), "Failed to transfer CEL");
        emit Withdrawn(msg.sender, amount);
    }

    function requestLoan(uint256 amount) external {
        User storage user = users[msg.sender];
        require(!user.hasActiveLoan, "User already has an active loan");
        require(amount <= (user.stakedAmount * loanToValueRatio) / 100, "Loan amount exceeds LTV ratio");

        user.hasActiveLoan = true;
        user.loanAmount = amount;
        user.loanRepaymentDeadline = block.timestamp + 30 days; // Repayment deadline after 30 days
        emit LoanRequested(msg.sender, amount);
    }

    function repayLoan(uint256 amount) external {
        User storage user = users[msg.sender];
        require(user.hasActiveLoan, "No active loan");
        require(amount <= user.loanAmount, "Amount exceeds loan amount");
        require(celoToken.transferFrom(msg.sender, address(this), amount), "Failed to transfer CEL");

        user.loanAmount -= amount;
        if (user.loanAmount == 0) {
            user.hasActiveLoan = false;
        }
        emit LoanRepaid(msg.sender, amount);
    }

    function calculateReward(address staker) internal {
        rewards[staker] += (users[staker].stakedAmount * dailyRewardRate) / 100;
    }

    function claimRewards() external {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards to claim");

        rewards[msg.sender] = 0;
        require(celoToken.transfer(msg.sender, reward), "Failed to transfer rewards");
    }

    function penalizeDefault(address borrower) internal {
        User storage user = users[borrower];
        require(user.hasActiveLoan, "No active loan");

        // Confiscate staked assets
        uint256 confiscationAmount = user.stakedAmount;
        user.stakedAmount = 0;

        // Transfer confiscated assets to lenders as compensation
        require(celoToken.transfer(msg.sender, confiscationAmount), "Failed to transfer confiscated CEL");

        // Reset user's loan details
        user.hasActiveLoan = false;
        user.loanAmount = 0;
        emit Default(borrower, confiscationAmount);
    }
}

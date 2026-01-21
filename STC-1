// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal interface for an on-chain stock that is ERC-20 compatible,
///         but adds transfer validation, snapshots, dividends, voting, and issuer actions.
///
///         This is an *interface spec*, not an implementation.
///
///         Intended to be paired with:
///         - an indexer (events -> cap table / reports)
///         - optional identity/attestation module (off-chain or on-chain)
interface STC1 {
    // =========
    // ERC-20 compatibility (subset; implement full ERC-20 in practice)
    // =========
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);

    function totalSupply() external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // =========
    // Transfer validation + rich transfer
    // =========

    /// @notice Standardized rejection codes for transfer validation.
    /// @dev Keep codes stable; reasons are for humans, codes are for integrators.
    enum TransferCode {
        OK,
        PAUSED,
        SENDER_FROZEN,
        RECEIVER_FROZEN,
        NOT_ELIGIBLE_SENDER,
        NOT_ELIGIBLE_RECEIVER,
        RESTRICTED_JURISDICTION,
        LOCKUP_ACTIVE,
        INSUFFICIENT_BALANCE,
        AMOUNT_TOO_LARGE,
        RULE_VIOLATION,
        UNKNOWN
    }

    /// @notice Preflight check: will a transfer succeed?
    /// @param from Sender (could be msg.sender or a custodian)
    /// @param to Receiver
    /// @param amount Amount of shares
    /// @param data Optional metadata (e.g., compliance proof, routing info)
    function canTransfer(
        address from,
        address to,
        uint256 amount,
        bytes calldata data
    ) external view returns (bool ok, TransferCode code);

    /// @notice Transfer with attached metadata (indexers love this; compliance systems need it).
    /// @dev Must emit Transfer like ERC-20 plus a richer event below.
    function transferWithData(
        address to,
        uint256 amount,
        bytes calldata data
    ) external returns (bool);

    /// @notice TransferFrom with attached metadata.
    function transferFromWithData(
        address from,
        address to,
        uint256 amount,
        bytes calldata data
    ) external returns (bool);

    event TransferWithData(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 amount,
        bytes data,
        TransferCode code
    );

    // =========
    // Freezes / pause (minimum controls)
    // =========
    function paused() external view returns (bool);
    function isFrozen(address account) external view returns (bool);

    event Paused(address indexed by);
    event Unpaused(address indexed by);
    event Frozen(address indexed account, address indexed by);
    event Unfrozen(address indexed account, address indexed by);

    // =========
    // Snapshots (record dates)
    // =========

    /// @notice Creates a snapshot ID for record-date operations (dividends/voting).
    function snapshot() external returns (uint256 snapshotId);

    function balanceOfAt(address owner, uint256 snapshotId) external view returns (uint256);
    function totalSupplyAt(uint256 snapshotId) external view returns (uint256);

    event SnapshotCreated(uint256 indexed snapshotId, address indexed by);

    // =========
    // Dividends / distributions
    // =========

    /// @notice A dividend declared on a snapshot record date.
    /// @dev payoutToken = address(0) can mean "native" in some systems, or forbid it.
    struct Dividend {
        uint256 snapshotId;        // record date snapshot
        address payoutToken;       // e.g., stablecoin
        uint256 totalAmount;       // total payout amount
        uint256 claimedAmount;     // running total claimed
        bytes32 termsHash;         // hash of terms/doc for audits
        bool active;
    }

    function getDividend(uint256 dividendId) external view returns (Dividend memory);

    /// @notice Declares a dividend payable pro-rata to holders at snapshotId.
    /// @dev totalAmount deposited/escrowed by implementation rules (not in interface).
    function declareDividend(
        uint256 snapshotId,
        address payoutToken,
        uint256 totalAmount,
        bytes32 termsHash
    ) external returns (uint256 dividendId);

    /// @notice Returns claimable amount for holder for a given dividend.
    function dividendEntitlement(uint256 dividendId, address holder) external view returns (uint256);

    /// @notice Claim dividend (pull model; push model is optional but messy).
    function claimDividend(uint256 dividendId) external returns (uint256 claimed);

    event DividendDeclared(
        uint256 indexed dividendId,
        uint256 indexed snapshotId,
        address indexed payoutToken,
        uint256 totalAmount,
        bytes32 termsHash
    );

    event DividendClaimed(
        uint256 indexed dividendId,
        address indexed holder,
        uint256 amount
    );

    // =========
    // Voting
    // =========

    enum VoteChoice { Against, For, Abstain }

    struct VoteEvent {
        uint256 snapshotId;      // record date snapshot for voting power
        uint64 startTime;        // unix seconds
        uint64 endTime;          // unix seconds
        bytes32 proposalHash;    // hash(pointer) to proposal content
        bool closed;
    }

    function getVoteEvent(uint256 voteId) external view returns (VoteEvent memory);

    /// @notice Creates a vote event using snapshot-based voting power.
    function createVoteEvent(
        uint256 snapshotId,
        uint64 startTime,
        uint64 endTime,
        bytes32 proposalHash
    ) external returns (uint256 voteId);

    /// @notice Optional delegation; implementations may support it or always return zero address.
    function delegateOf(address holder) external view returns (address);

    /// @notice Cast vote with snapshot voting power.
    function castVote(uint256 voteId, VoteChoice choice) external returns (uint256 weight);

    function voteTally(uint256 voteId) external view returns (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes);

    event VoteEventCreated(uint256 indexed voteId, uint256 indexed snapshotId, uint64 startTime, uint64 endTime, bytes32 proposalHash);
    event VoteCast(uint256 indexed voteId, address indexed voter, VoteChoice choice, uint256 weight);

    // =========
    // Corporate actions (minimal v0)
    // =========

    /// @notice Split or reverse-split via global factor (implementation-defined mechanics).
    /// @dev Example: 2-for-1 split: numerator=2, denominator=1
    ///      Reverse split 1-for-10: numerator=1, denominator=10
    function applySplit(uint256 numerator, uint256 denominator, bytes32 termsHash) external;

    event SplitApplied(uint256 numerator, uint256 denominator, bytes32 termsHash, address indexed by);

    // =========
    // Issuer documents / disclosures
    // =========

    /// @notice Store references to official documents (prospectus, notices, terms).
    /// @dev uri could be IPFS/https; docHash is content hash for integrity.
    function getDocument(bytes32 docId) external view returns (string memory uri, bytes32 docHash, uint64 updatedAt);

    function setDocument(bytes32 docId, string calldata uri, bytes32 docHash) external;

    event DocumentUpdated(bytes32 indexed docId, string uri, bytes32 docHash, uint64 updatedAt, address indexed by);

    // =========
    // Cap table / custody hooks (optional but realistic)
    // =========

    /// @notice If custody is used: beneficial owner behind a custodian.
    /// @dev Implementations may return the same address if no custody layer exists.
    function beneficialOwnerOf(address holderOrCustodian) external view returns (address);
}

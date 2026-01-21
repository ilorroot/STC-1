# STC-1 — Stock Token Contract Interface

**STC-1** defines a **standard on-chain interface for tokenized equity (stocks)**.

It is an **ERC-20–compatible interface** that adds the primitives required to represent real-world shares on a blockchain, including **transfer validation, record dates (snapshots), dividends, voting, corporate actions, and issuer disclosures**.

STC-1 is intentionally an **interface specification**, not an implementation.

---

## Motivation

Existing token standards (ERC-20, ERC-721, ERC-777) were designed for **open crypto assets**, not regulated financial instruments.

They lack first-class support for:
- shareholder rights
- corporate actions
- record dates
- entitlement calculations
- compliance-aware transfers

STC-1 addresses this gap by defining **what a stock token must expose**, without prescribing **how** it must be implemented.

The goal is interoperability, auditability, and long-term compatibility with regulated financial infrastructure.

---

## Design Principles

- **Compatibility first**  
  STC-1 preserves ERC-20 semantics so existing wallets, indexers, and exchanges can integrate with minimal friction.

- **Interface, not policy**  
  The standard defines *what must exist*, not *how rules are enforced*.  
  Identity, compliance, custody, and governance models are implementation choices.

- **Record-date correctness**  
  Snapshots are first-class primitives. Dividends and voting must be based on immutable record dates.

- **Auditability by design**  
  All critical actions emit structured events suitable for regulatory reporting and reconciliation.

- **Minimal but extensible**  
  STC-1 intentionally covers the minimum viable surface for equity tokens. Advanced features are deferred.

---

## What STC-1 Provides (v1)

### 1. ERC-20 Compatibility
STC-1 tokens:
- expose standard ERC-20 balance and transfer functions
- emit ERC-20 `Transfer` and `Approval` events
- remain indexable by existing Ethereum tooling

This ensures ecosystem compatibility while extending functionality.

---

### 2. Transfer Validation & Metadata
STC-1 introduces:
- `canTransfer(...)` preflight checks with standardized rejection codes
- `transferWithData(...)` and `transferFromWithData(...)`
- explicit support for compliance, custody, and routing metadata

This enables:
- regulated transfer restrictions
- deterministic failure reasons
- off-chain compliance systems to reason about transfers

---

### 3. Snapshots (Record Dates)
STC-1 includes native snapshot support:
- `snapshot()` creates immutable record dates
- `balanceOfAt(...)` and `totalSupplyAt(...)` provide historical state

Snapshots are required for:
- dividend entitlements
- voting power
- corporate actions

---

### 4. Dividends & Distributions
STC-1 defines a dividend lifecycle:
- declaration tied to a snapshot (record date)
- pro-rata entitlement calculation
- claim-based payout model
- explicit audit references via `termsHash`

The interface supports cash dividends and token-based distributions.

---

### 5. Shareholder Voting
STC-1 includes:
- snapshot-based voting power
- proposal hashing for off-chain documents
- deterministic voting windows
- explicit vote tallies

Voting power is derived from ownership at the record date, not current balances.

---

### 6. Corporate Actions (Minimal Set)
STC-1 v1 supports:
- stock splits and reverse splits via ratio application
- issuer-declared lifecycle events

This establishes a baseline for equity lifecycle management.

---

### 7. Issuer Documents & Disclosures
STC-1 includes a document registry:
- immutable references to official disclosures
- content hashing for integrity
- timestamped updates

This allows on-chain linkage to prospectuses, notices, and shareholder communications.

---

### 8. Custody & Beneficial Ownership Hooks
STC-1 exposes:
- `beneficialOwnerOf(...)` for custody/nominee models

Implementations may choose:
- direct ownership
- omnibus custody
- transfer agent mediated custody

The interface supports all models without enforcing one.

---

## What STC-1 Explicitly Does *Not* Define (Yet)

STC-1 is intentionally scoped. The following are **out of scope for v1**:

- Identity / KYC standards  
- Jurisdiction-specific regulatory logic  
- Custody mechanics and settlement guarantees  
- Rights issues and spin-offs  
- Debt instruments (bonds, notes)  
- Cross-chain settlement or finality assumptions  

These concerns are expected to be layered *on top of* STC-1, not embedded into it.

---

## Intended Use Cases

STC-1 is designed for:
- tokenized public or private equities
- regulated trading venues
- transfer agents
- custodians and nominee structures
- corporate governance tooling
- dividend and cap-table systems

It is **not** intended for:
- utility tokens
- meme tokens
- permissionless DeFi primitives

---

## Status

- **Specification:** Draft (v1)
- **Implementations:** None (by design)
- **Audits:** N/A
- **Stability:** Interface subject to change before v1.0 freeze

---

## Credits

**Concept & Specification:**  
Ilor Root

**Influences & Prior Art:**  
- Ethereum ERC-20 (EIP-20)  
- OpenZeppelin Contracts  
- Security token standards (ERC-1400 family, ERC-3643)  
- Traditional equity market infrastructure (record dates, transfer agents, corporate actions)

STC-1 builds on these ideas but does not claim compatibility with any existing security token standard.

---

## License

MIT License — free to use, extend, and implement.

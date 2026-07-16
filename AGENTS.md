# AGENTS.md

## Project overview

This repository contains a single Solidity smart contract, `FlokiFrunkFOMO` — a
BEP-20 "reflection" meme token for Binance Smart Chain (BSC). The canonical
vendor source is checked in (mislabeled) as `README.md`. A Foundry project was
added around it so the contract can be built, tested, and deployed:

- `src/FlokiFrunkFOMO.sol` — the contract source (an exact copy of `README.md`,
  which keeps the `.md` file untouched while giving Foundry a `.sol` file to
  compile). If `README.md` ever changes, re-sync this copy.
- `test/FlokiFrunkFOMO.t.sol` — Foundry tests that fork BSC, deploy the token,
  and exercise transfers (with and without fees).
- `script/Deploy.s.sol` — deployment script used for live-node runs.
- `foundry.toml` — pins `solc_version = 0.8.6` (the contract's exact pragma) and
  defines the `bsc` RPC alias.

The tests/scripts intentionally use a tiny inline `Vm` cheatcode interface
instead of `forge-std`, so there are **no external library/submodule
dependencies** to install.

## Cursor Cloud specific instructions

Toolchain: this project uses **Foundry** (`forge`, `cast`, `anvil`). The
binaries live in `~/.foundry/bin` (already on `PATH` via `~/.bashrc`). If `forge`
is not found, run `foundryup`.

Standard commands (run from the repo root):

- Build: `forge build`
- Lint: `forge lint` (the vendor contract emits benign warnings; exit code 0)
- Test: `forge test -vv`

Non-obvious caveats:

- **The contract can only be deployed/tested against a BSC mainnet fork.** Its
  constructor calls the hardcoded PancakeSwap V2 router at
  `0x10ED43C718714eb63d5aA57B78B54704E256024E` (`factory().createPair(...)`), so
  deploying to a bare local chain reverts. The tests handle this by calling
  `vm.createSelectFork("bsc")`; deployment scripts must target a BSC fork.
- This requires outbound network access to a BSC RPC
  (`https://bsc-dataseed.binance.org`, aliased as `bsc` in `foundry.toml`). If
  that endpoint is blocked/rate-limited, substitute another BSC RPC URL.
- To run against a live local node: start a fork with
  `anvil --fork-url https://bsc-dataseed.binance.org` (chain id 56), then deploy
  with `forge script script/Deploy.s.sol:Deploy --rpc-url http://127.0.0.1:8545
  --private-key <anvil_key> --broadcast` and interact via `cast`.
- Do **not** run `forge fmt`/reformat `src/FlokiFrunkFOMO.sol`; it is verbatim
  vendor source and should stay byte-identical to `README.md`.

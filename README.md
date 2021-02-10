# EDDITS Identity portal

A web application to manage on-chain Identities.

## Features

- [ ] Deploy a new on-chain Identity.
- [ ] Manage permissions and keys of Identities.
- [ ] List and interact with claims on Identities.
- [ ] Access trusted issuers applications to request claims.

## Developers

### Dependencies

Non-usual dependencies:
- [ethers](https://github.com/ethers-io/ethers.js/) is used as the provider interface and web3 utilities.
- [web3-react](https://github.com/NoahZinsmeister/web3-react) is used to manage the state of ethereum accounts and wallets.

### Configuration

#### Variables

Set them in `.env` for default values.
- You need an infura ID to connect to infura provider in order to connect with wallet connect or MEWConnect. This infura key must be provided as `REACT_APP_INFURA_ID`.

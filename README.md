# Demo
https://user-images.githubusercontent.com/58892938/184806377-dc96c144-7657-4421-b4dc-9a4b07c5ccb3.mov

# NFTIZ Multichain
Inspired by the original [NFTIZ](https://nftiz-app.xyz/) which only supports creating NFT on polygon, the multichain version of NFTIZ supports creating NFT on [Celo](https://celo.org/), [Algorand](https://www.algorand.com/), [Harmony](https://www.harmony.one/) and [Solana](https://solana.com/).

# User flow
Instead of first page for collecting info and second page for displaying minting result, there are 3 pages in NFTIZ multichain :
- First page: collect info and select chains creators want to deploy NFT on.
- Second page: collect creators' addresses on the selected chains.
- Third page: display ipfs link and minting transactions of selected chains.

# How minting works
The original NFTIZ uploads the design to IPFS using nft.storage and call [nftport.xyz](https://www.nftport.xyz/) API to mint the NFT.

In NFTIZ multichain, I'm using [tatum.io](https://tatum.io/) as the minting provider since it supports more chains. I also call 2 apis, one to upload image / metadata, another to mint on selected chains.

# How to run it
You can refer to figma plugin development [guide](https://www.figma.com/plugin-docs/setup) on how to import this plugin to your figma desktop app, then you need to create a `.env` file at the home directory of this repo like below which stored the API credential.
```
# API KEY in mainnet or testnet
TATUM_API_KEY='your tatum api key in testnet or mainnet'
# true to use testnet, false to use mainnet
IS_TESTNET=true
``` 

Run `yarn build` then open the plugin in figma.

# Original NFTIZ
![NFTIZ Banner](https://ipfs.io/ipfs/bafkreidwzlz3zmlupwz33yuctmrrfwqmwgcturpz7xttdsomy4skrivel4)

NFTIZ is a Figma plugin that enables you to transform your design into a NFT. With NFTIZ, it's super easy to turn your Figma creations into NFT, put them on sale on OpenSea or send them as gifts to your friends.
You can download it here: https://bit.ly/32vuyEd

This project was built during the Web3Jam Hackathon organized by ETHGlobal.

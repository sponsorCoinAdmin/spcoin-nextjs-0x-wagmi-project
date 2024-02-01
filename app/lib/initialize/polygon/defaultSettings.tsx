import {  TokenElement } from '../../structure/types'
 
 const defaultSellToken: TokenElement = { 
  chainId: 137,
  symbol: "WBTC",
  img: "/resources/images/tokens/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
  name: "Wrapped Bitcoin",
  address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
  decimals: 8
 };

 const defaultBuyToken: TokenElement = { 
  chainId: 137,
  symbol: "USDT",
  img: "/resources/images/tokens/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
  name: "Tether USD",
  address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  decimals: 6
};

const defaultRecipient = { 
  "symbol": "Trees",
  "img": "/resources/images/recipients/SaveTheTrees.png",
  "name": "Save The Trees",
  "address": "Save The Trees Wallet Address"
};

const defaultAgent = { 
  "symbol": "Tweety",
  "img": "/resources/images/agents/TweetyBird.png",
  "name": "Tweety Bird",
  "address": "TweetyBird's Wallet Address"
};

const defaultNetworkSettings = {
  defaultSellToken : defaultSellToken,
  defaultBuyToken  : defaultBuyToken,
  defaultRecipient : defaultRecipient,
  defaultAgent     : defaultAgent
}

export { defaultNetworkSettings };

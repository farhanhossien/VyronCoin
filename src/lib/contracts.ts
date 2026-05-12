export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "97");

export const VYRON_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  "function pause()",
  "function unpause()",
  "function paused() view returns (bool)",
  "function owner() view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event AdminMint(address indexed to, uint256 amount)",
  "event ContractPaused(address account)",
  "event ContractUnpaused(address account)"
];

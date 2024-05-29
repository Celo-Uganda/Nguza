import {
    BrowserProvider,
    Interface,
    InterfaceAbi,
    JsonRpcProvider,
    ethers,
  } from "ethers";
  
  const RPC = "https://celo-mainnet.infura.io";
  
  export default class Web3 {
    public provider: JsonRpcProvider | BrowserProvider;
    constructor() {
      this.provider = window.ethereum.isMiniPay
        ? new ethers.BrowserProvider(window.ethereum)
        : new ethers.JsonRpcProvider(RPC);
    }
  
    async contract(
      contractAddress: `0x${string}`,
      ABI: Interface | InterfaceAbi,
      connectedWalletAddress: `0x${string}`
    ) {
      const signer = await this.provider.getSigner(
        connectedWalletAddress ?? undefined
      );
      return new ethers.Contract(contractAddress, ABI, signer);
    }
  }
  
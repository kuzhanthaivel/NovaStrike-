import StarkshootAbi from "@/contract/abi/starkshoot.json";
import StakeAbi from "@/contract/abi/stake.json";
import { ethers } from "ethers";

const isBrowser = () => typeof window !== "undefined";
const ethereum = isBrowser() ? window.ethereum : null;

const STAKE_CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
// const STARKSHOOT_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_STARKSHOOT_TOKEN_ADDRESS || '';
const ETH_STARKSHOOT_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_ETH_STARKSHOOT_TOKEN_ADDRESS || '';
const DECIMALS = process.env.NEXT_PUBLIC_DECIMALS ? parseInt(process.env.NEXT_PUBLIC_DECIMALS) : 18;

export const APPROVE_STARKSHOOT = async ({ amount }: { amount: number }) => {
    if (!ethereum) {
        console.error("Ethereum provider not available.");
        return;
    }

    const convertedAmount = ethers.utils.parseUnits(amount.toString(), DECIMALS);

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    // Approve ETH_STARKSHOOT_TOKEN_ADDRESS
    const Role = new ethers.Contract(ETH_STARKSHOOT_TOKEN_ADDRESS, StarkshootAbi, signer);

    try {
        const tx = await Role.approve(STAKE_CONTRACT, convertedAmount);
        console.log("Approval Transaction Hash:", tx.hash);
        return tx;
    } catch (error) {
        console.error("Error approving token:", error);
        throw error;
    }
};

export const STAKE_STARKSHOOT = async ({ amount }: { amount: number }) => {
    if (!ethereum) {
        console.error("Ethereum provider not available.");
        return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    // Use the ERC-20 token at ETH_STARKSHOOT_TOKEN_ADDRESS
    const tokenContract = new ethers.Contract(ETH_STARKSHOOT_TOKEN_ADDRESS, StarkshootAbi, signer);
    const stakeContract = new ethers.Contract(STAKE_CONTRACT, StakeAbi, signer);

    const account = await signer.getAddress();
    const weiAmount = ethers.utils.parseUnits(amount.toString(), DECIMALS);

    const allowance = await tokenContract.allowance(account, STAKE_CONTRACT);

    try {
        // Approve if needed
        if (allowance.lt(weiAmount)) {
            console.log("Not enough allowance. Approving now...");
            const approveTx = await tokenContract.approve(STAKE_CONTRACT, weiAmount);
            await approveTx.wait();
            console.log("Approval successful:", approveTx.hash);
        } else {
            console.log("Sufficient allowance exists. Skipping approval.");
        }

        // Stake using the token, not ETH
        const stakeTx = await stakeContract.stake(weiAmount); // assuming it doesn't require `value`
        await stakeTx.wait();
        console.log("Staking successful:", stakeTx.hash);

        return stakeTx;
    } catch (error) {
        console.error("Error during staking:", error);
        throw error;
    }
};

export const FETCHESTK_BALANCE = async (accountAddress: string) => {
    if (!ethereum) {
        console.error("Ethereum provider not available.");
        return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(ETH_STARKSHOOT_TOKEN_ADDRESS, StarkshootAbi, signer);
    const balance = await tokenContract.balanceOf(accountAddress);
    return ethers.utils.formatUnits(balance, DECIMALS);
};

export const GET_STAKE_INFO = async (accountAddress: string) => {
    if (!ethereum) {
      console.error("Ethereum provider not available.");
      return;
    }
  
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const stakeContract = new ethers.Contract(STAKE_CONTRACT, StakeAbi, signer);
  
    try {
      const [tokensStaked, rewards] = await stakeContract.getStakeInfo(accountAddress);
      return {
        tokensStaked: ethers.utils.formatUnits(tokensStaked, DECIMALS),
        rewards: ethers.utils.formatUnits(rewards, DECIMALS),
      };
    } catch (error) {
      console.error("Error fetching stake info:", error);
      throw error;
    }
};

export const CLAIM_REWARDS = async () => {
    if (!ethereum) {
      console.error("Ethereum provider not available.");
      return;
    }
  
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const stakeContract = new ethers.Contract(STAKE_CONTRACT, StakeAbi, signer);
  
    try {
      const tx = await stakeContract.claimRewards();
      await tx.wait();
      console.log("Rewards claimed successfully:", tx.hash);
      return tx;
    } catch (error) {
      console.error("Error claiming rewards:", error);
      throw error;
    }
};  
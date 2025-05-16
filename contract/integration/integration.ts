import StarkshootAbi from "@/contract/abi/starkshoot.json";
// import StakeAbi from "@/contract/abi/stake.json";
import StakingAbi from "@/contract/abi/staking.json";
import { ethers } from "ethers";

const isBrowser = () => typeof window !== "undefined";
const ethereum = isBrowser() ? window.ethereum : null;

// const STAKING_CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const STAKING_CONTRACT = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS || '';
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
        const tx = await Role.approve(STAKING_CONTRACT, convertedAmount);
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

    // Connect to staking contract
    const stakeContract = new ethers.Contract(STAKING_CONTRACT, StakingAbi, signer);

    const weiAmount = ethers.utils.parseEther(amount.toString()); // Assuming `amount` is in ETH

    try {
        // Directly send native ETH as msg.value
        const stakeTx = await stakeContract.stake({ value: weiAmount });
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
    const stakeContract = new ethers.Contract(STAKING_CONTRACT, StakingAbi, signer);
  
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

export const CLAIM_REWARDS = async (matchId: number) => {
    if (!ethereum) {
      console.error("Ethereum provider not available.");
      return;
    }
  
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const stakeContract = new ethers.Contract(STAKING_CONTRACT, StakingAbi, signer);
  
    try {
      const tx = await stakeContract.withdrawAndClaim(matchId);
      await tx.wait();
      console.log("Rewards claimed successfully:", tx.hash);
      return tx;
    } catch (error) {
      console.error("Error claiming rewards:", error);
      throw error;
    }
};

export const GET_ALL_STAKE_INFO = async (walletAddress: string) => {
    if (!ethereum) {
      console.error("Ethereum provider not available.");
      return;
    }
  
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const stakeContract = new ethers.Contract(STAKING_CONTRACT, StakingAbi, signer);
  
    try {
      const [matchIds, stakedAmounts, rewards, claimedStatuses, isWinnerFlags] =
        await stakeContract.getAllStakeInfoForAddress(walletAddress);
  
      return matchIds.map((matchId: number, index: number) => ({
        matchId: matchId.toString(),
        staked: ethers.utils.formatEther(stakedAmounts[index]),
        reward: ethers.utils.formatEther(rewards[index]),
        claimed: claimedStatuses[index],
        isWinner: isWinnerFlags[index],
      }));
    } catch (error) {
      console.error("Error fetching stake info:", error);
      throw error;
    }
};  
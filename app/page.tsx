'use client';
import { useEffect, useState } from 'react';
import Char1 from '../public/images/character/character_1.png';
import Char2 from '../public/images/character/character_2.png';
import Map1 from '../public/images/map/map1.png';
import Map2 from '../public/images/map/map2.png';
import ArrowLeft from './assets/arrowleft.svg';
import ArrowRight from './assets/arrowright.svg';
import PlayerStatus from './assets/player-status.svg';
import Star from './assets/star.svg';
import Coin from './assets/coin.svg';
import BtnTemp from './assets/btn-template.svg';
import Shop from './assets/shop.svg';
import Rank from './assets/rank.svg';
import Gear from './assets/gear.svg';
import PlayTypeSelecter from './assets/play-type/play-btn-select.svg';
import PlayTypeSelecterBG from './assets/play-type/bg.svg';
import Solo from './assets/play-type/solo-play.svg';
import PlayTypeDeSelecter from './assets/play-type/play-btn-unselected.svg';
import Team from './assets/play-type/team-up.svg';
import Playbtn from './assets/play-btn.svg';
import Close from './assets/button-cancel.svg';
// Adding placeholder item images
import ItemGun from '../public/images/items/gun.png';
import ItemGrenade from '../public/images/items/grenade.png';
// import ItemCharacter from '../public/images/character/character_1.png';
import ItemDiamond from '../public/images/items/diamond.png';
import ItemGold from '../public/images/items/gold.png';
import LeaderboardPopup from './components/LeaderboardPopup';
import { FaAward } from "react-icons/fa6";

import Image from 'next/image';
import { CustomWallet } from './components/Wallet';
import SimpleGameFrame from './components/iframe';
import { CLAIM_REWARDS, FETCHESTK_BALANCE, GET_STAKE_INFO, STAKE_STARKSHOOT } from '@/contract/integration/integration';
import { useAccount } from 'wagmi';

// Add interface for Popup props
// interface PopupProps {
//   title: string;
//   onClose: () => void;
//   children: ReactNode;
// }

export default function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState(0);
  const [selectedMap, setSelectedMap] = useState(0);
  const [showShopPopup, setShowShopPopup] = useState(false);
  const [showStartPopup, setShowStartPopup] = useState(false);
  const [showLeaderPopup, setShowLeaderPopup] = useState(false);
  const [showStakePopup, setShowStakePopup] = useState(false);
  const [showClaimPopup, setShowClaimPopup] = useState(false);
  const [shopCategory, setShopCategory] = useState<keyof typeof shopItems>('Guns');
  const [selectedMode, setSelectedMode] = useState<"solo" | "team" | null>(null);
  const [showGameFrame, setShowGameFrame] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(10);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [stakeInfo, setStakeInfo] = useState<{ tokensStaked: string; rewards: string } | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);


  // const [showSquadOptions, setShowSquadOptions] = useState(false);
  // const [playerName, setPlayerName] = useState('');
  // const [roomId, setRoomId] = useState('');


  const characters = [
    { name: 'Kodama Archer', special: 'Forest Blend', difficulty: 4, image: Char1 },
    { name: 'Spirit Walker', special: 'Ethereal Dash', difficulty: 3, image: Char2 },
    { name: 'Bathhouse Guardian', special: 'Steam Burst', difficulty: 2, image: Char1 },
    { name: 'Wind Runner', special: 'Gale Force', difficulty: 1, image: Char2 },
  ];

  const maps = [
    { name: 'Enchanted Forest', difficulty: 1, image: Map1 },
    { name: 'Floating Castle', difficulty: 3, image: Map2 },
    { name: 'Spirit Bathhouse', difficulty: 4, image: Map1 },
    { name: 'Valley of Wind', difficulty: 2, image: Map2 },
  ];

  // Updated shop items with images
  const shopItems = {
    Guns: [
      { name: 'Spirit Rifle', price: 300, image: ItemGun, type: 'Gun' },
      { name: 'Ghost Blaster', price: 450, image: ItemGun, type: 'Gun' },
      { name: 'Phantom Pistol', price: 250, image: ItemGun, type: 'Gun' },
      { name: 'Soul Sniper', price: 500, image: ItemGun, type: 'Gun' },
    ],
    Grenades: [
      { name: 'Flash Orb', price: 200, image: ItemGrenade, type: 'Grenade' },
      { name: 'Spirit Bomb', price: 350, image: ItemGrenade, type: 'Grenade' },
      { name: 'Smoke Wisp', price: 180, image: ItemGrenade, type: 'Grenade' },
      { name: 'Frost Sphere', price: 320, image: ItemGrenade, type: 'Grenade' },
    ],
    Characters: [
      { name: 'Shadow Ninja', price: 500, image: Char1, type: 'Character' },
      { name: 'Mystic Monk', price: 600, image: Char2, type: 'Character' },
      { name: 'Sakura Warrior', price: 550, image: Char1, type: 'Character' },
      { name: 'Kitsune Rogue', price: 650, image: Char2, type: 'Character' },
    ],
    Diamond: [
      { name: 'Diamond Pack (500)', price: 100, image: ItemDiamond, type: 'Diamond' },
      { name: 'Diamond Pack (1000)', price: 180, image: ItemDiamond, type: 'Diamond' },
      { name: 'Diamond Pack (2500)', price: 400, image: ItemDiamond, type: 'Diamond' },
      { name: 'Diamond Pack (5000)', price: 700, image: ItemDiamond, type: 'Diamond' },
    ],
    Gold: [
      { name: 'Gold Pack (1000)', price: 80, image: ItemGold, type: 'Gold' },
      { name: 'Gold Pack (2500)', price: 150, image: ItemGold, type: 'Gold' },
      { name: 'Gold Pack (5000)', price: 280, image: ItemGold, type: 'Gold' },
      { name: 'Gold Pack (10000)', price: 500, image: ItemGold, type: 'Gold' },
    ],
  };

  const handleNextCharacter = () => {
    setSelectedCharacter((prev) => (prev + 1) % characters.length);
  };

  const handlePreviousCharacter = () => {
    setSelectedCharacter((prev) => (prev - 1 + characters.length) % characters.length);
  };

  const handleNextMap = () => {
    setSelectedMap((prev) => (prev + 1) % maps.length);
  };

  const handlePreviousMap = () => {
    setSelectedMap((prev) => (prev - 1 + maps.length) % maps.length);
  };

  const handleStakePopup = () => {
    setShowStakePopup(true);
  }
  const handleOpenStartPopup = () => {
    setShowStartPopup(true);
  };

  const handleCloseStartPopup = () => {
    setShowStartPopup(false);
  };

  const handleStartGame = () => {
    setShowStartPopup(false);
    setShowGameFrame(true);
  };
  
  const handleCloseGameFrame = () => {
    setShowGameFrame(false);
  };

  const handleStaking = async (stakeAmount: number) => {
    setStakeLoading(true);
    try {
      const result = await STAKE_STARKSHOOT({ amount: stakeAmount });
      console.log("Staking successful:", result);
      const hash = result?.hash;
      if (hash) {
        setTransactionHash(hash);
        console.log("Transaction Hash:", hash);
      }
      setShowStakePopup(false);
      handleOpenStartPopup();
    } catch (error) {
      console.error("Staking failed:", error);
    } finally {
      setStakeLoading(false);
    }
  }
  const account = useAccount();

  const fetchStakeInfo = async () => {
    setLoadingInfo(true);
    try {
      if (account?.address) {
        const result = await GET_STAKE_INFO(account?.address);
        setStakeInfo(result || null);
      }
    } catch (error) {
      console.error("Error fetching stake info", error);
    } finally {
      setLoadingInfo(false);
    }
  };

  const claimReward = async () => {
    setClaiming(true);
    try {
      const result = await CLAIM_REWARDS();
      console.log("Claim rewards result",result);
      setClaimSuccess(true);
      // Refresh info after claim
      await fetchStakeInfo();
    } catch (error) {
      console.error("Error claiming rewards", error);
    } finally {
      setClaiming(false);
    }
  };

  const fetchEStkBalance = async () => {
    if (account?.address) {
      const result = await FETCHESTK_BALANCE(account.address);
      setTokenBalance(result || '0');
    }
  }

  useEffect(() => {
    if (account?.address) {
      fetchEStkBalance();
    }
  }, [account?.address]);

  useEffect(() => {
    if (showClaimPopup && account?.address) {
      fetchStakeInfo();
      setClaimSuccess(false);
    }
  }, [showClaimPopup, account?.address]);


  return (
    <div className="min-h-screen font-Ghibli bg-[url('/images/bgimage.svg')] bg-cover bg-center text-white font-sans flex flex-col relative overflow-x-hidden overflow-y-auto">

      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-yellow-700 to-transparent"></div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center p-6 mx-10 relative z-10">
        <h1 className="text-3xl font-bold text-yellow-400 drop-shadow-lg">STARKSHOOT</h1>
        <div className="flex gap-6 items-center">
          <div>
            <div className="flex items-center gap-2">
              <Image src={Coin} alt="Coin" width={30} height={30} className="text-yellow-400" />
              <span className="text-yellow-400 text-xl font-bold">2345</span>
            </div>
          </div>
          <div className="relative flex flex-col items-center justify-center -mt-1 hover:cursor-pointer hover:scale-105 transition duration-300">
            <Image src={BtnTemp} alt="Button Template" width={60} height={60} className="align-middle" />
            <div className="absolute flex flex-col items-center justify-center" onClick={() => setShowShopPopup(true)}>
              <Image src={Shop} alt="Shop Icon" width={30} height={30} className="align-middle" />
              <span className="text-yellow-400 font-bold text-xs text-center relative bottom-2 mt-2">SHOP</span>
            </div>
          </div>
          <div className="relative flex flex-col items-center justify-center -mt-1 hover:cursor-pointer hover:scale-105 transition duration-300">
            <Image src={BtnTemp} alt="Button Template" width={60} height={60} className="align-middle" />
            <div className="absolute flex flex-col items-center justify-center" onClick={() => setShowLeaderPopup(true)}>
              <Image src={Rank} alt="Rank Icon" width={35} height={35} className="align-middle" />
              <span className="text-yellow-400 font-bold text-xs text-center relative bottom-2 mt-2">RANK</span>
            </div>
          </div>
          <div className="relative flex flex-col items-center justify-center -mt-1 hover:cursor-pointer hover:scale-105 transition duration-300">
            <Image src={BtnTemp} alt="Button Template" width={60} height={60} className="align-middle" />
            <div className="absolute flex flex-col items-center justify-center">
              <Image src={Gear} alt="Gear Icon" width={30} height={30} className="align-middle" />
              <span className="text-yellow-400 font-bold text-xs text-center relative bottom-2 mt-2">GEAR</span>
            </div>
          </div>
          <div className="relative flex flex-col items-center justify-center -mt-1 hover:cursor-pointer hover:scale-105 transition duration-300"
            onClick={() => setShowClaimPopup(true)}
            >
            <Image src={BtnTemp} alt="Button Template" width={60} height={60} className="align-middle" />
            <div className="absolute flex flex-col items-center justify-center">
              <FaAward className='text-2xl text-red-700' />
              <span className="text-yellow-400 font-bold text-xs text-center relative bottom-2 mt-2">CLAIM</span>
            </div>
          </div>
          <div className="relative z-50">
            <CustomWallet />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-1 top-0 relative z-10">
        {/* Character and Map Section */}
        <div className="flex flex-col md:flex-row flex-1 gap-8">
          {/* Left Side - Character */}
          <div className="relative w-1/2 bottom-20 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center">
              <div className='relative w-80 h-20 top-12 right-10 z-10'>
                <p className='relative top-6 left-12 text-base font-bold'>ONLINE</p>
                <Image src={PlayerStatus} alt="Player Status" className="mb-4" />
              </div>
              <p className='relative top-6 right-36 text-black text-base font-bold z-10'>@username</p>
              {/* Container for arrows and image */}
              <div className="relative w-80 h-[500px] cursor-pointer">
                {/* Left Arrow */}
                <Image
                  src={ArrowLeft}
                  alt="Arrow Left"
                  onClick={handlePreviousCharacter}
                  className="absolute left-[-50px] top-1/2 transform -translate-y-1/2 z-10 transition duration-300 hover:scale-110"
                />

                {/* Character Image */}
                <div
                  className="relative w-full h-full transform hover:scale-105 transition duration-300" 
                >
                  <Image
                    src={characters[selectedCharacter].image}
                    alt="Character"
                    className="rounded-lg"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="flex justify-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Image
                        key={index}
                        src={Star}
                        alt="star"
                        className={index < characters[selectedCharacter].difficulty ? 'opacity-100' : 'opacity-30'}
                        width={20}
                        height={20}
                      />
                    ))}
                  </div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-1 text-center">
                  {characters[selectedCharacter].name} | Lv. {characters[selectedCharacter].difficulty}
                </h2>
                <h2 className='text-xl font-bold text-yellow-400 text-center'>
                  Specialist: {characters[selectedCharacter].special}
                </h2>
                {/* Right Arrow */}
                <Image
                  src={ArrowRight}
                  alt="Arrow Right"
                  onClick={handleNextCharacter}
                  className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 z-10 transition duration-300 hover:scale-110"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="w-1/2 flex flex-col items-end pr-12">
            {/* Map Section */}
            <div className="w-full max-w-md">
              <div
                className="relative h-80 overflow-hidden rounded-t-lg cursor-pointer w-full border border-[#FDBD1F]"
              >
                {/* Map Image */}
                <Image
                  src={maps[selectedMap].image}
                  alt={maps[selectedMap].name}
                  className="w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

                {/* Map Info */}
                <div className="absolute bottom-4 left-0 right-0 px-3 text-center z-10">
                  <div className="flex justify-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Image
                        key={index}
                        src={Star}
                        alt="star"
                        className={index < maps[selectedMap].difficulty ? 'opacity-100' : 'opacity-30'}
                        width={20}
                        height={20}
                      />
                    ))}
                  </div>
                  <p className="font-bold text-xl text-yellow-400">{maps[selectedMap].name}</p>
                </div>

                {/* Left Arrow */}
                <Image
                  src={ArrowLeft}
                  alt="Arrow Left"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviousMap();
                  }}
                  className="absolute left-4 bottom-5 z-20 transition duration-300 hover:scale-110 cursor-pointer"
                />

                {/* Right Arrow */}
                <Image
                  src={ArrowRight}
                  alt="Arrow Right"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextMap();
                  }}
                  className="absolute right-4 bottom-5 z-20 transition duration-300 hover:scale-110 cursor-pointer"
                />
              </div>

              {/* Yellow Bar Below */}
              <div className="h-6 w-full bg-[#FDBD1F] rounded-b-lg -mt-1"></div>
                {/* Play Mode Selection */}
                <div className='flex space-x-4 justify-center items-center mt-4'>
                  {/* SOLO CARD */}
                  <div className="flex justify-center items-center mt-4">
                    <div onClick={() => setSelectedMode("solo")}>
                      <div
                        className={`hover:cursor-pointer transform transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center relative`}
                      >
                        {/* Background image behind the main image */}
                        {selectedMode === "solo" && (
                          <Image
                            src={PlayTypeSelecterBG}
                            alt="Background"
                            className="absolute z-0"
                            height={200}
                            width={200}
                          />
                        )}

                        {/* Main image */}
                        <Image
                          src={selectedMode === "solo" ? PlayTypeSelecter : PlayTypeDeSelecter}
                          alt="Solo Play Type"
                          height={100}
                          width={100}
                          className="relative z-10"
                        />

                        {/* Icon and text overlay */}
                        <div className="relative bottom-[54px] flex flex-col items-center z-20">
                          <Image src={Solo} alt="Solo Icon" height={20} width={20} />
                          <h2 className="text-lg mt-1 font-bold text-yellow-400 relative bottom-2">SOLO</h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TEAM CARD */}
                  <div className="flex justify-center items-center mt-4">
                    <div onClick={() => setSelectedMode("team")}>
                      <div
                        className={`hover:cursor-pointer transform transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center relative`}
                      >
                        {/* Background image behind the main image */}
                        {selectedMode === "team" && (
                          <Image
                            src={PlayTypeSelecterBG}
                            alt="Background"
                            className="absolute z-0"
                            height={200}
                            width={200}
                          />
                        )}

                        {/* Main image */}
                        <Image
                          src={selectedMode === "team" ? PlayTypeSelecter : PlayTypeDeSelecter}
                          alt="Solo Play Type"
                          height={100}
                          width={100}
                          className="relative z-10"
                        />

                        {/* Icon and text overlay */}
                        <div className="relative bottom-[54px] flex flex-col items-center z-20">
                          <Image src={Team} alt="Team Icon" height={33} width={33} />
                          <h2 className="text-lg mt-1 font-bold text-yellow-400 relative bottom-2">TEAM</h2>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

        {/* Fixed bottom-right button container with increased spacing */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-6 items-end w-auto z-20">  
          <div className='hover:cursor-pointer hover:scale-105 transition duration-300'
            onClick={handleStakePopup}
            >
            <Image
              src={Playbtn}
              alt="Play Button"
              className="w-full h-full"
            />
            <p className='relative text-3xl bottom-16 text-center font-bold'>
              START
            </p>
          </div>
        </div>
      </main>

      {showClaimPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black opacity-90 z-40" />

          {/* Modal Window */}
          <div className="relative z-50 bg-[#343B50] border-2 border-white rounded-2xl max-w-2xl w-full max-h-[90vh] px-6 py-8 text-white">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 hover:cursor-pointer"
              onClick={() => setShowClaimPopup(false)}
            >
              <Image src={Close} alt="Close" width={30} height={30} />
            </button>

            {/* Header */}
            <h2
              className="text-3xl font-bold text-center mb-4"
              style={{
                textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
              }}
            >
              REWARD
            </h2>

            <hr className="w-full border-t-2 border-white mb-4" />

            {/* Content */}
            {loadingInfo ? (
              <p className="text-center text-lg">Fetching rewards...</p>
            ) : stakeInfo ? (
              <div className="text-center space-y-4">
                <div>
                  <p className="text-lg">Tokens Staked:</p>
                  <p className="text-2xl font-semibold">{stakeInfo.tokensStaked} ESTK</p>
                </div>
                <div>
                  <p className="text-lg">Unclaimed Rewards:</p>
                  <p className="text-2xl font-semibold">{stakeInfo.rewards} STK</p>
                </div>

                {claimSuccess && (
                  <p className="text-green-400 font-medium mt-2">✅ Rewards claimed successfully!</p>
                )}

                <button
                  onClick={claimReward}
                  disabled={claiming}
                  className={`mt-6 px-6 py-2 text-lg rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition ${
                    claiming ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {claiming ? "Claiming..." : "Claim Rewards"}
                </button>
              </div>
            ) : (
              <p className="text-center text-red-400">No stake info found.</p>
            )}
          </div>
        </div>
      )}

      {showStakePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black opacity-90 z-40"></div>

        {/* Modal Window */}
        <div className="relative z-50 bg-[#343B50] border-2 border-white rounded-2xl max-w-2xl w-full max-h-[90vh]">
          {/* Close Button */}
          <button
            className="absolute top-1 -right-3 hover:cursor-pointer"
            onClick={() => setShowStakePopup(false)}
          >
            <Image src={Close} alt="Close" width={60} height={60} />
          </button>

          {/* Header */}
          <h2 className="text-2xl font-bold text-white my-3 text-center"
            style={{ 
              textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
            }}>
            STAKE
          </h2>
          <hr className="w-full border-t-2" />

          {/* Content */}
          <div className="p-8 flex flex-col gap-6">
            {/* Custom stake amount field */}
            <div className="text-white text-md font-medium tracking-wide">
              Balance: <span className="text-yellow-400">{parseFloat(tokenBalance).toFixed(4)} ESTK</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-white text-2xl font-bold tracking-wider pl-1"
                    style={{ 
                      textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                    }}>
                Custom Amount
              </label>
              <input
                type="number"
                placeholder="Enter custom amount"
                min="10"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 text-lg border-2 border-gray-300 focus:outline-none"
              />
              <button
                onClick={() => setStakeAmount(Number(parseFloat(tokenBalance).toFixed(4)))}
                className="bg-yellow-400 px-4 rounded-lg text-black font-semibold hover:bg-yellow-300 transition"
              >
                MAX
              </button>
            </div>
            
            {/* Preset amounts - first row */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-xl font-bold tracking-wider pl-1"
                    style={{ 
                      textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                    }}>
                Quick Select
              </label>
              <div className="flex gap-4 w-full">
                {[10, 15, 20].map((amount) => (
                  <button 
                    key={amount}
                    onClick={() => setStakeAmount(amount)}
                    className={`flex-1 py-3 px-2 rounded-lg font-bold text-lg transition-all hover:cursor-pointer ${
                      stakeAmount === amount
                        ? 'bg-yellow-400 text-gray-900 border-2 border-yellow-600' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {amount} STK
                  </button>
                ))}
              </div>
              
              {/* Preset amounts - second row */}
              <div className="flex gap-4 w-full mt-2">
                <button 
                  onClick={() => setStakeAmount(50)}
                  className={`flex-1 py-3 px-2 rounded-lg font-bold text-lg transition-all hover:cursor-pointer ${
                    stakeAmount === 50
                      ? 'bg-yellow-400 text-gray-900 border-2 border-yellow-600' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  50 STK
                </button>
              </div>
            </div>
            
            {/* Stake button */}
            <button
              onClick={() => handleStaking(stakeAmount)}
              className={`relative py-3 flex items-center justify-center mt-4 hover:cursor-pointer ${
                stakeLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={stakeLoading}
              style={{ filter: "drop-shadow(0 4px 0 rgba(0,0,0,0.5))" }}
            >
              <div className="absolute inset-0 bg-yellow-400 rounded-lg border-b-4 border-yellow-600"></div>
              <span
                className="relative z-10 text-xl font-bold tracking-wider"
                style={{
                  textShadow:
                    "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                }}
              >
                {stakeLoading ? "Staking..." : "Stake"}
              </span>
            </button>
          </div>
        </div>
      </div>
      )}

      {showStartPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black opacity-90 z-40"></div>

          {/* Modal Window */}
          <div className="relative z-50 bg-[#343B50] border-2 border-white rounded-2xl max-w-2xl w-full max-h-[90vh]">
            {/* Close Button */}
            <button
              className="absolute top-1 -right-3 hover:cursor-pointer"
              onClick={handleCloseStartPopup}
            >
              <Image src={Close} alt="Close" width={60} height={60} />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold text-white my-3 text-center"
              style={{ 
                textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
              }}>
              SQUAD SETUP
            </h2>
            <hr className="w-full border-t-2" />

            {/* Content */}
            <div className="p-8 flex flex-col gap-6">
              {/* Player name field */}
              <div className="flex flex-col gap-1">
                <label className="text-white text-2xl font-bold tracking-wider pl-1"
                      style={{ 
                        textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                      }}>
                  {selectedMode === "team" ? "Room Name" : "Player name"}
                </label>
                <input
                  type="text"
                  placeholder={selectedMode === "team" ? "eg. starkspace" : "eg. Deepakexe"}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 text-lg border-2 border-gray-300 focus:outline-none"
                />
              </div>
              
              {/* Room ID field */}
              <div className="flex flex-col gap-1">
                <label className="text-white text-2xl font-bold tracking-wider pl-1"
                      style={{ 
                        textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                      }}>
                  {selectedMode === "team" ? "Create Room ID" : "Room ID"}
                </label>
                <input
                  type="text"
                  placeholder="eg. 324225"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 text-lg border-2 border-gray-300 focus:outline-none"
                />
              </div>
              
              {/* Buttons */}
              <div className="grid grid-cols-2 gap-6 mt-4">
                <button
                  onClick={handleStartGame}
                  className="relative py-3 flex items-center justify-center"
                  style={{ filter: "drop-shadow(0 4px 0 rgba(0,0,0,0.5))" }}
                >
                  <div className="absolute inset-0 bg-yellow-400 rounded-lg border-b-4 border-yellow-600"></div>
                  <span className="relative z-10 text-xl font-bold tracking-wider"
                      style={{ 
                        textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                      }}>
                    Join Room
                  </span>
                </button>
                
                <button
                  onClick={handleStartGame}
                  className="relative py-3 flex items-center justify-center"
                  style={{ filter: "drop-shadow(0 4px 0 rgba(0,0,0,0.5))" }}
                >
                  <div className="absolute inset-0 bg-yellow-400 rounded-lg border-b-4 border-yellow-600"></div>
                  <span className="relative z-10 text-xl font-bold tracking-wider"
                      style={{ 
                        textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                      }}>
                    Create Room
                  </span>
                </button>
              </div>
              {transactionHash && (
                <div className="bg-gray-800 rounded-lg p-4 text-white text-sm flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-4">
                  <span className="font-semibold">Transaction:</span>
                  <a
                    href={`https://base-sepolia.blockscout.com/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-300 hover:underline break-all"
                  >
                    {`${transactionHash.slice(0, 6)}...${transactionHash.slice(-6)}`}
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(transactionHash);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-2 py-1 rounded-md text-xs"
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Popup */}
      {showLeaderPopup && (
        <LeaderboardPopup showLeaderboard={showLeaderPopup} setShowLeaderboard={setShowLeaderPopup} />
      )}

      {showGameFrame && (
        <SimpleGameFrame onClose={handleCloseGameFrame} />
      )}

      {/* Shop Popup - Updated with Item Images in Grid */}
      {showShopPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black opacity-90 z-40"></div>

          {/* Modal Window */}
          <div className="relative z-50 bg-[#343B50] border-2 border-white rounded-2xl max-w-4xl w-full max-h-[90vh]">
            {/* Close Button */}
            <button
              className="absolute top-1 -right-3 hover:cursor-pointer"
              onClick={() => setShowShopPopup(false)}
            >
              <Image src={Close} alt="Close" width={60} height={60} />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold text-white my-3 text-center">SPIRIT SHOP</h2>
            <hr className="w-full border-t-2" />

            {/* Content */}
            <div className="flex p-6">
              {/* Sidebar */}
              <div className="w-48 flex flex-col gap-2 pr-6 border-r-2 border-yellow-400 overflow-y-auto">
                {Object.keys(shopItems).map((category) => (
                  <button
                    key={category}
                    onClick={() => setShopCategory(category as keyof typeof shopItems)}
                    className={`text-lg font-bold py-3 px-4 rounded-xl transition hover:cursor-pointer ${
                      shopCategory === category
                        ? 'bg-[#FDBD1F] text-white'
                        : 'text-white hover:bg-[#FDBD1F] hover:text-white bg-[rgba(255,255,255,0.2)]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Items Display */}
              <div className="flex-1 pl-6 overflow-y-auto pr-2 max-h-[500px]">
                <div className="grid grid-cols-2 gap-4">
                  {shopItems[shopCategory].map((item, index) => (
                    <div key={index} className="bg-[#FDBD1F] rounded-lg p-1">
                      <div className="bg-gray-500 rounded-lg overflow-hidden">
                        <div className="h-40 bg-gray-500 relative">
                          <Image
                            src={item.image}
                            alt={item.name}
                            className={`w-full h-full ${item.type === "Character" ? "object-contain" : "object-cover"}`}
                          />
                        </div>
                        <div className="p-2 bg-[#FDBD1F] flex justify-between items-center">
                          <div>
                            <h3
                              className="text-lg font-bold"
                              style={{
                                textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                              }}
                            >
                              {item.name}
                            </h3>
                            <p
                              className="uppercase text-yellow-400 font-bold text-sm"
                              style={{
                                textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                              }}
                            >
                              UNLOCK NOW
                            </p>
                          </div>
                          <div className="relative w-24 h-12 flex-shrink-0">
                            <Image src={Playbtn} alt="play-btn" layout="fill" className="object-contain" />
                            <div className="absolute inset-0 flex space-x-1 items-center justify-center">
                              <Image src={Coin} alt="Coin" width={16} height={16} />
                              <span className="font-bold text-lg text-black">{item.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
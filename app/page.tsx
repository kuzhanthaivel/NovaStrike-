'use client';

import { useEffect, useRef, useState } from 'react';
import { FaVolumeUp, FaShoppingBag, FaTimes, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { IoSettings } from "react-icons/io5";
import { MdLeaderboard } from "react-icons/md";
import Char1 from '../public/images/character/character_1.png';
import Char2 from '../public/images/character/character_2.png';
import Map1 from '../public/images/map/map1.png';
import Map2 from '../public/images/map/map2.png';
// Adding placeholder item images
import ItemGun from '../public/images/items/gun.png';
import ItemGrenade from '../public/images/items/grenade.png';
import ItemCharacter from '../public/images/character/character_1.png';
import ItemDiamond from '../public/images/items/diamond.png';
import ItemGold from '../public/images/items/gold.png';
import Image from 'next/image';
import StartPopup from './components/StartPopUp';
import LeaderboardPopup from './components/LeaderboardPopup';

// Add interface for Popup props
// interface PopupProps {
//   title: string;
//   onClose: () => void;
//   children: ReactNode;
// }

export default function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState(0);
  const [selectedMap, setSelectedMap] = useState(0);
  const [showCharacterPopup, setShowCharacterPopup] = useState(false);
  const [showShopPopup, setShowShopPopup] = useState(false);
  const [showMapPopup, setShowMapPopup] = useState(false);
  const [showStartPopup, setShowStartPopup] = useState(false);
  const [showLeaderPopup, setShowLeaderPopup] = useState(false);
  const [shopCategory, setShopCategory] = useState<keyof typeof shopItems>('Guns');

  // const [showSquadOptions, setShowSquadOptions] = useState(false);
  // const [playerName, setPlayerName] = useState('');
  // const [roomId, setRoomId] = useState('');


  const characters = [
    { name: 'Kodama Archer', special: 'Forest Blend', difficulty: 2, image: Char1 },
    { name: 'Spirit Walker', special: 'Ethereal Dash', difficulty: 3, image: Char2 },
    { name: 'Bathhouse Guardian', special: 'Steam Burst', difficulty: 4, image: Char1 },
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
      { name: 'Spirit Rifle', price: 300, image: ItemGun },
      { name: 'Ghost Blaster', price: 450, image: ItemGun },
      { name: 'Phantom Pistol', price: 250, image: ItemGun },
      { name: 'Soul Sniper', price: 500, image: ItemGun },
    ],
    Grenades: [
      { name: 'Flash Orb', price: 200, image: ItemGrenade },
      { name: 'Spirit Bomb', price: 350, image: ItemGrenade },
      { name: 'Smoke Wisp', price: 180, image: ItemGrenade },
      { name: 'Frost Sphere', price: 320, image: ItemGrenade },
    ],
    Characters: [
      { name: 'Shadow Ninja', price: 500, image: ItemCharacter },
      { name: 'Mystic Monk', price: 600, image: ItemCharacter },
      { name: 'Sakura Warrior', price: 550, image: ItemCharacter },
      { name: 'Kitsune Rogue', price: 650, image: ItemCharacter },
    ],
    Diamond: [
      { name: 'Diamond Pack (500)', price: 100, image: ItemDiamond },
      { name: 'Diamond Pack (1000)', price: 180, image: ItemDiamond },
      { name: 'Diamond Pack (2500)', price: 400, image: ItemDiamond },
      { name: 'Diamond Pack (5000)', price: 700, image: ItemDiamond },
    ],
    Gold: [
      { name: 'Gold Pack (1000)', price: 80, image: ItemGold },
      { name: 'Gold Pack (2500)', price: 150, image: ItemGold },
      { name: 'Gold Pack (5000)', price: 280, image: ItemGold },
      { name: 'Gold Pack (10000)', price: 500, image: ItemGold },
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

  const videoRef = useRef<HTMLVideoElement>(null);

useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  // Slow down the video
  video.playbackRate = 0.5;

  // Ensure video starts playing
  video.play().catch((err) => console.error("Video play error:", err));
}, []);


  return (
    <div className="min-h-screen text-white font-sans flex flex-col relative overflow-x-hidden overflow-y-auto">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/video/bgvid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-yellow-700 to-transparent"></div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center p-6 relative z-10">
        <h1 className="text-3xl font-bold text-yellow-400 drop-shadow-lg">Game Name</h1>
        <div className="flex gap-6 items-center">
          <button className="p-2 rounded-full bg-black bg-opacity-50 text-yellow-400 hover:text-yellow-300 transition hover:cursor-pointer">
            <FaVolumeUp className="text-xl" />
          </button>
          <button className="p-2 rounded-full bg-black bg-opacity-50 text-yellow-400 hover:text-yellow-300 transition hover:cursor-pointer"
            onClick={() => setShowLeaderPopup(true)} >
            <MdLeaderboard className="text-xl" />
          </button>
          <button className="p-2 rounded-full bg-black bg-opacity-50 text-yellow-400 hover:text-yellow-300 transition hover:cursor-pointer">
            <IoSettings className="text-xl" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 relative z-10">
        {/* Character and Map Section */}
        <div className="flex flex-1">
          {/* Left Side - Character */}
          <div className="w-1/2 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
                {characters[selectedCharacter].name}
              </h2>

              <div
                className="relative w-80 h-[500px] cursor-pointer transform hover:scale-105 transition duration-300"
                onClick={() => setShowCharacterPopup(true)}
              >
                <Image
                  src={characters[selectedCharacter].image}
                  alt="Character"
                  className="rounded-lg"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="w-1/2 flex flex-col items-end pr-12">
            {/* Map Section */}
            <div className="w-full max-w-md">
              <div
                className="relative h-80 overflow-hidden rounded-lg mb-4 cursor-pointer w-full"
                onClick={() => setShowMapPopup(true)}
              >
                <Image
                  src={maps[selectedMap].image}
                  alt={maps[selectedMap].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                  <p className="font-bold text-xl text-yellow-400">{maps[selectedMap].name}</p>
                  <p className="text-yellow-300">
                    {'★'.repeat(maps[selectedMap].difficulty) +
                      '☆'.repeat(5 - maps[selectedMap].difficulty)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed bottom-right button container with increased spacing */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-6 items-end w-auto z-20">
          <button
            onClick={() => setShowShopPopup(true)}
            className="flex justify-center items-center gap-2 bg-yellow-400 text-black font-bold py-4 px-16 rounded-full shadow-md hover:bg-yellow-300 transition transform hover:scale-105 hover:cursor-pointer"
          >
            <FaShoppingBag className="text-xl" /> Shop
          </button>
          <button className="bg-yellow-400 text-black font-bold py-5 px-28 rounded-full shadow-lg hover:bg-yellow-300 transition transform hover:scale-105 text-2xl hover:cursor-pointer"
                onClick={() => setShowStartPopup(true)}>
            START
          </button>
        </div>
      </main>

      {showStartPopup && (
        <StartPopup showStartPopup={showStartPopup} setShowStartPopup={setShowStartPopup} />
      )}

      {/* Leaderboard Popup */}
      {showLeaderPopup && (
        <LeaderboardPopup showLeaderboard={showLeaderPopup} setShowLeaderboard={setShowLeaderPopup} />
      )}

      {/* Character Selection Popup - Full Screen */}
      {showCharacterPopup && (
        <div className="fixed inset-0 bg-black opacity-90 flex flex-col items-center justify-center z-50 p-8">
          <button
            className="absolute top-6 right-6 text-yellow-400 hover:text-yellow-300 text-3xl hover:cursor-pointer"
            onClick={() => setShowCharacterPopup(false)}
          >
            <FaTimes />
          </button>
          
          <h2 className="text-4xl font-bold text-yellow-400 mb-8">SELECT CHARACTER</h2>
          
          <div className="flex items-center justify-center w-full max-w-5xl gap-8">
            {/* Left Arrow */}
            <button
              onClick={handlePreviousCharacter}
              className="bg-yellow-400 text-black hover:bg-yellow-300 p-6 rounded-full transition font-bold text-2xl flex-shrink-0"
            >
              <FaChevronLeft />
            </button>
            
            {/* Character Content */}
            <div className="flex flex-col items-center flex-1">
              {/* Character Image - Properly sized */}
              <div className="relative w-80 h-[400px] mb-8">
                <Image
                  src={characters[selectedCharacter].image}
                  alt={characters[selectedCharacter].name}
                  className="rounded-lg object-contain"
                  layout="fill"
                />
              </div>
              
              {/* Character Info - Centered Below Image */}
              <div className="text-center mb-8 px-4">
                <h3 className="text-3xl font-bold text-yellow-400 mb-4">
                  {characters[selectedCharacter].name}
                </h3>
                <p className="text-xl text-white mb-4">
                  Special: {characters[selectedCharacter].special}
                </p>
                <p className="text-2xl text-yellow-300">
                  {'★'.repeat(characters[selectedCharacter].difficulty) +
                  '☆'.repeat(5 - characters[selectedCharacter].difficulty)}
                </p>
              </div>
              
              {/* Navigation Indicators */}
              <div className="flex gap-2">
                {characters.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-4 h-4 rounded-full ${
                      index === selectedCharacter ? 'bg-yellow-400' : 'bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Right Arrow */}
            <button
              onClick={handleNextCharacter}
              className="bg-yellow-400 text-black hover:bg-yellow-300 p-6 rounded-full transition font-bold text-2xl flex-shrink-0 hover:cursor-pointer"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Map Selection Popup - Updated with Carousel */}
      {showMapPopup && (
        <div className="fixed inset-0 bg-black opacity-90 flex flex-col items-center justify-center z-50 p-8">
          <button
            className="absolute top-6 right-6 text-yellow-400 hover:text-yellow-300 text-3xl hover:cursor-pointer"
            onClick={() => setShowMapPopup(false)}
          >
            <FaTimes />
          </button>
          
          <h2 className="text-4xl font-bold text-yellow-400 mb-8">SELECT MAP</h2>
          
          <div className="flex items-center justify-center w-full max-w-5xl gap-8">
            {/* Left Arrow */}
            <button
              onClick={handlePreviousMap}
              className="bg-yellow-400 text-black hover:bg-yellow-300 p-6 rounded-full transition font-bold text-2xl flex-shrink-0"
            >
              <FaChevronLeft />
            </button>
            
            {/* Map Content */}
            <div className="flex flex-col items-center flex-1">
              {/* Map Image */}
              <div className="relative w-full h-[400px] mb-8">
                <Image
                  src={maps[selectedMap].image}
                  alt={maps[selectedMap].name}
                  className="rounded-lg object-cover"
                  layout="fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              </div>
              
              {/* Map Info */}
              <div className="text-center mb-8 px-4">
                <h3 className="text-3xl font-bold text-yellow-400 mb-4">
                  {maps[selectedMap].name}
                </h3>
                <p className="text-2xl text-yellow-300">
                  {'★'.repeat(maps[selectedMap].difficulty) +
                  '☆'.repeat(5 - maps[selectedMap].difficulty)}
                </p>
              </div>
              
              {/* Navigation Indicators */}
              <div className="flex gap-2">
                {maps.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-4 h-4 rounded-full ${
                      index === selectedMap ? 'bg-yellow-400' : 'bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Right Arrow */}
            <button
              onClick={handleNextMap}
              className="bg-yellow-400 text-black hover:bg-yellow-300 p-6 rounded-full transition font-bold text-2xl flex-shrink-0 hover:cursor-pointer"
            >
              <FaChevronRight />
            </button>
          </div>
          
          {/* Select Button */}
          <button 
            onClick={() => setShowMapPopup(false)}
            className="mt-8 bg-yellow-400 text-black font-bold py-3 px-16 rounded-full shadow-lg hover:bg-yellow-300 transition transform hover:scale-105 text-xl hover:cursor-pointer"
          >
            SELECT
          </button>
        </div>
      )}

      {/* Shop Popup - Updated with Item Images in Grid */}
      {showShopPopup && (
        <div className="fixed inset-0 bg-black opacity-95 flex flex-col items-center justify-center z-50 p-8">
          <button
            className="absolute top-6 right-6 text-yellow-400 hover:text-yellow-300 text-3xl hover:cursor-pointer"
            onClick={() => setShowShopPopup(false)}
          >
            <FaTimes />
          </button>
          
          <h2 className="text-4xl font-bold text-yellow-400 mb-8">SPIRIT SHOP</h2>
          
          <div className="flex max-w-6xl w-full bg-black bg-opacity-70 border-2 border-yellow-400 rounded-xl p-6">
            {/* Sidebar */}
            <div className="w-48 flex flex-col gap-4 pr-6 border-r-2 border-yellow-400">
              {Object.keys(shopItems).map((category) => (
                <button
                  key={category}
                  onClick={() => setShopCategory(category as keyof typeof shopItems)}
                  className={`text-lg font-bold py-3 px-4 rounded-lg transition hover:cursor-pointer ${
                    shopCategory === category
                      ? 'bg-yellow-400 text-black'
                      : 'text-yellow-300 hover:bg-yellow-400 hover:text-black'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Items Display - Grid Layout */}
            <div className="flex-1 pl-6 max-h-[500px] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                {shopItems[shopCategory].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col bg-gray-900 rounded-lg border-2 border-yellow-400 hover:border-yellow-300 transition overflow-hidden"
                  >
                    {/* Item Image */}
                    <div className="relative h-40 w-full bg-gray-800">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="object-contain"
                        layout="fill"
                      />
                    </div>
                    
                    {/* Item Info */}
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-yellow-300 mb-2">{item.name}</h3>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-yellow-400 font-bold text-lg mr-1">{item.price}</span>
                          <span className="text-yellow-300 text-xl">⚡</span>
                        </div>
                        <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition font-bold hover:cursor-pointer">
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Update Popup component with proper typing
// function Popup({ title, onClose, children }: PopupProps) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
//       <div className="bg-black border-2 border-yellow-400 rounded-xl p-6 max-w-3xl w-full relative">
//         <button
//           className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300 text-xl"
//           onClick={onClose}
//         >
//           <FaTimes />
//         </button>
//         <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">{title}</h2>
//         {children}
//       </div>
//     </div>
//   );
// }
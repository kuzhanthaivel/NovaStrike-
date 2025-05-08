import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface StartPopupProps {
  showStartPopup: boolean;
  setShowStartPopup: (value: boolean) => void;
}

export default function StartPopup({ showStartPopup, setShowStartPopup }: StartPopupProps) {
  const [showSquadOptions, setShowSquadOptions] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = () => {
    alert(`Joining room "${roomId}" as "${playerName}"`);
  };

  const handleCreateRoom = () => {
    alert(`Creating room with player "${playerName}"`);
  };

  if (!showStartPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="relative bg-black w-full max-w-2xl rounded-lg p-6 sm:p-10 shadow-2xl text-white max-h-screen overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-yellow-400 hover:text-white transition-colors duration-200 hover:cursor-pointer"
          onClick={() => setShowStartPopup(false)}
        >
          <FaTimes className="h-6 w-6" />
        </button>

        {/* Game Logo/Title */}
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400 text-black font-bold text-2xl sm:text-3xl px-6 py-2 rounded transform -rotate-2 shadow-lg">
            BATTLE ZONE
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-8 text-center uppercase tracking-wider">
          {!showSquadOptions ? "Select Match Type" : "Squad Setup"}
        </h2>

        {/* Match Type Selection */}
        {!showSquadOptions ? (
          <div className="space-y-4">
            <button
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-lg text-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-3 hover:cursor-pointer"
              onClick={() => (window.location.href = '/game')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              SOLO MODE
            </button>
            <button
              className="w-full bg-black text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 rounded-lg text-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-3 hover:cursor-pointer"
              onClick={() => setShowSquadOptions(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              SQUAD MODE
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Player Name Input */}
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-black px-2 text-yellow-400 text-xs font-semibold">
                PLAYER NAME
              </label>
              <input
                type="text"
                placeholder="Enter your callsign"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black border-2 border-yellow-400 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300"
              />
            </div>

            {/* Room ID Input */}
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-black px-2 text-yellow-400 text-xs font-semibold">
                ROOM ID
              </label>
              <input
                type="text"
                placeholder="Enter existing room code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black border-2 border-yellow-400 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300"
              />
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <button
                className="bg-black hover:bg-yellow-400 text-yellow-400 hover:text-black border-2 border-yellow-400 px-4 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center hover:cursor-pointer"
                onClick={handleJoinRoom}
                disabled={!playerName || !roomId}
              >
                JOIN ROOM
              </button>
              <button
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-3 rounded-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center hover:cursor-pointer"
                onClick={handleCreateRoom}
                disabled={!playerName}
              >
                CREATE ROOM
              </button>
            </div>

            {/* Back Button */}
            <button
              className="mt-4 text-white hover:text-yellow-400 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-300 hover:cursor-pointer"
              onClick={() => setShowSquadOptions(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              BACK TO MODES
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
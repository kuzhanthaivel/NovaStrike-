import React from "react";
import { AngleClipButton } from "./Button";

interface RoomPopupProps {
    handleStartGame: () => void;
    handleCloseStartPopup: () => void;
    soldierName: string;
    setSoldierName: (name: string) => void;
    zoneCode: string;
    setZoneCode: (code: string) => void;
    duration: string;
    setDuration: (duration: string) => void;
}

const RoomPopup: React.FC<RoomPopupProps> = ({ handleStartGame, handleCloseStartPopup, soldierName, setSoldierName, zoneCode, setZoneCode, duration, setDuration }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black opacity-80 z-50">
      <div className="relative w-full max-w-lg">
        {/* Border layer with clip path */}
        <div 
          className="absolute inset-0 bg-cyan-500" 
          style={{
            clipPath: "polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)"
          }}
        />
        
        {/* Content layer with slightly smaller clip path and inset */}
        <div 
          className="relative m-0.5 bg-black bg-opacity-60 backdrop-filter backdrop-blur-md p-8 text-white"
          style={{
            clipPath: "polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)"
          }}
        >
          <div className="space-y-6 text-base">
            <div>
              <label className="block text-lg font-semibold">Soldier Name:</label>
              <input
                type="text"
                placeholder="Enter name"
                className="w-full mt-2 px-3 py-2 text-white text-base border border-gray-300"
                value={soldierName}
                onChange={(e) => setSoldierName(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-lg font-semibold">Zone Code:</label>
                <select className="w-full mt-2 px-3 py-2 text-white text-base border border-gray-300" value={zoneCode}
                  onChange={(e) => setZoneCode(e.target.value)}>
                  <option>Dolakpoor</option>
                  <option>Zone-X</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-lg font-semibold invisible">Time</label>
                <select className="w-full mt-2 px-3 py-2 text-white text-base border border-gray-300" value={duration}
                    onChange={(e) => setDuration(e.target.value)}>
                  <option>1 Min</option>
                  <option>5 Min</option>
                </select>
              </div>
            </div>

            <div className="text-sm italic text-gray-200">No rooms available.</div>

            <div className="flex justify-between pt-6">
                <div>
                    <AngleClipButton
                        text="Home" 
                        onClick={handleCloseStartPopup}
                        className="w-48"
                    />
                </div>

                <div>
                    <AngleClipButton
                        text="Join Room" 
                        onClick={handleStartGame}
                        className="w-48"
                    />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPopup;
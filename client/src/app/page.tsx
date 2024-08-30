"use client";

import React, { useState, useEffect, useContext } from "react";
import { v4 } from "uuid";
import { API_URL } from "../../constants";
import { WEBSOCKET_URL } from "../../constants";
import { AuthContext } from "../../components/authService";
import { WebSocketContext } from "../../components/wsService";
import { useRouter } from "next/navigation";

const Index = () => {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);

  const [roomName, setRoomName] = useState("");
  const { user } = useContext(AuthContext);
  const { setConnection } = useContext(WebSocketContext);
  const router = useRouter();

  const handleLogout = async (e: React.SyntheticEvent) => {
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!res.ok) {
        throw new Error('Logout failed');
      }
      router.push('/login');
    } catch (err) {
      console.error(err); 
  }};
  const getRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/webSocket/getRooms`, {
        method: "GET",
      });

      const room = await res.json();
      if (res.ok) {
        setRooms(room);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  const submitHandLer = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/webSocket/AddRoom`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: v4(),
          name: roomName,
        }),
      });
      if (res.ok) {
        getRooms();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const joinRoom = (roomId: string) => {
    const websocket = new WebSocket(
      `${WEBSOCKET_URL}/webSocket/joinRoom/${roomId}?userId=${user.id}&username=${user.username}`
    );
    if (websocket.OPEN) {
      setConnection(websocket);
      router.push("/application");
      return;
    }
  };

  return (
    <div
      className=" h-screen w-full justify-center items-start bg-cover"
      style={{
        backgroundImage:
          "url(https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=600)",
      }}
    >
      <div className="bg-opacity-5 shadow-black flex flex-col items-center p-6 mx-[40rem] my-12 bg-white rounded-lg shadow-2xl">
        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Enter chat room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button
            className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={submitHandLer}
          >
            Create Room
          </button>
        </div>
      </div>
      <div className="absolute top-4 right-4 border border-white rounded-lg bg-cyan-300 bg-opacity-20 shadow-xl hover:bg-cyan-300">
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="mt-auto mb-auto justify-start">
        <div className="font-serif text-stone-600 text-xl ml-6">
          Available Rooms:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6 mx-6">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="border border-white p-4 flex items-center rounded-md w-full shadow-2xl shadow-slate-600"
            >
              <div className="w-full">
                <div className="text-sm">Room</div>
                <div className="text-white font-serif text-lg">{room.name}</div>
              </div>
              <div>
                <button
                  className="px-4 text-white bg-blue rounded-md hover:bg-cyan-500"
                  onClick={() => {
                    joinRoom(room.id);
                  }}
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;

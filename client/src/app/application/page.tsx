"use client";

import React, { useState, useRef, useContext, useEffect } from "react";
import ChatBody from "../../../components/ChatBody";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { WebSocketContext } from "../../../components/wsService";
import { useRouter } from "next/navigation";
import { API_URL } from "../../../constants";
import autosize from 'autosize'
import { AuthContext } from "../../../components/authService";
import { json } from "stream/consumers";

export type Chat = {
  message: string;
  userId: string;
  username: string;
  roomId: string;
  type: "mine" | "friend";
};

const index = () => {
  const [chat, setChat] = useState<Array<Chat>>([]);
  const textArea = useRef<HTMLTextAreaElement>(null)
  const {connection} =useContext(WebSocketContext)
  const [users, setUsers] = useState<Array<{username:string}>>([])
  const {user} = useContext(AuthContext)

  const router = useRouter()

  useEffect(() => {
    if(connection === null){
      router.push("/")
      return
    }

    const roomId = connection.url.split('/')[5]

    async function GetUsers() {
      try{
        const res = await fetch(`${API_URL}/webSocket/getClients/${roomId}`,{
          method: 'GET',
          headers: {'content-type':'application/json'}
        })
        const data = await res.json()
        setUsers(data)
      }catch(err){
        console.log(err)
      }
    }
    GetUsers()
  },[])

  useEffect(() => {
    if(textArea.current){
      autosize(textArea.current)
    }

    if(connection === null){
      router.push("/")
      return
    }

    connection.onmessage = (ch) => {

      const c: Chat = JSON.parse(ch.data)

      if(c.message == 'A new user has joined the room'){
        setUsers([...users,{username:c.username}])
      }

      if(c.message == 'user left the chat'){
        const updateUsers = users.filter((user) => {user.username != c.username})
        setUsers([...updateUsers])
        setChat([...chat,c])
        return
      }

      user?.username == c.username ? (c.type = 'mine') : (c.type = 'friend')
      setChat([...chat,c])
    }

    connection.onclose = () => {}
    connection.onerror = () => {}
    connection.onopen = () => {}

  },[textArea, connection, chat, users])

  const sendMessage = () =>{
    if(!textArea.current?.value) return
    if(connection===null){
      router.push("/")
      return
    }
    connection.send(textArea.current.value)
    textArea.current.value=''
  }

  return (
    <>
      <div
        className="flex flex-col w-full bg-cover"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=600)",
        }}
      >
        <div className="p-4 md:mx-6 mb-14">
          <ChatBody data={chat} />
        </div>
        <div className="fixed bottom-0 mt-4 w-full">
          <div className="flex md:flex-row px-4 py-2 bg-gray md:mx-4 rounded-md bg-opacity-25">
            <div className="flex w-full mr-4 rounded-md border border-blue">
              <textarea
                ref = {textArea}
                placeholder="type your message here"
                className="w-full h-10 p-2 rounded-md focus:outline-none"
                style={{ resize: "none" }}
              />
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-md bg-blue text-white hover:bg-cyan-400 w-16" onClick={sendMessage}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;

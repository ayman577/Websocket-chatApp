import React from "react";
import { Chat } from "@/app/application/page";

type ChatBodyProps = {
  data: Array<Chat>;
};

const ChatBody: React.FC<ChatBodyProps> = ({ data }) => {
  return (
    <>
      {data.map((chat: Chat, index: number) => {
        if (chat.type === "mine") {
          return (
            <div
              className="flex flex-col mt-6 px-6 w-full text-right justify-end "
              key={index}
            >
              <div className="text-sm font-serif">{chat.username}</div>
              <div>
                <div className="bg-pink-400 text-white px-4 py-1 rounded-md inline-block mt-2 break-words max-w-xs md:max-w-md">
                  {chat.message}
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="mt-2 px-6" key={index}>
              <div className="text-sm font-serif">{chat.username}</div>
              <div>
                <div className="bg-white text-dark-secondary px-4 py-1 rounded-md inline-block mt-2 break-words max-w-xs md:max-w-md">
                  {chat.message}
                </div>
              </div>
            </div>
          );
        }
      })}
    </>
  );
};

export default ChatBody;
 
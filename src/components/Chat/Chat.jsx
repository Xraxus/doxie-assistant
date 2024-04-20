import React, { createContext } from "react";

export const ChatContext = createContext({});

const placeholderMessages = [
  { text: "Hello, who are you?", role: "user", date: "2021-07-01T11:59:00" },
  {
    text: "Hi, I'm Doxie Assistant!",
    role: "assistant",
    date: "2021-07-01T12:00:00",
  },
  {
    text: "Can you remind me when my next doctor’s appointment is?",
    role: "user",
    date: "2021-07-01T12:59:00",
  },
  {
    text: "Hey Kamil! Your next doctor’s appointment is on Thursday November 9th at 12:45 PM",
    role: "assistant",
    date: "2021-07-01T12:59:00",
  },
];

export default function ({ children }) {
  const [messages, setMessages] = React.useState(placeholderMessages);

  return (
    <div className="chat">
      <ChatContext.Provider value={{ messages, setMessages }}>
        {children}
      </ChatContext.Provider>
    </div>
  );
}

import React, { createContext } from "react";

export const ChatContext = createContext({});

const placeholderMessages = [];

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

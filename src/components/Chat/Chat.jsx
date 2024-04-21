import { createContext, useState } from "react";

export const ChatContext = createContext({});

export default function ({ children }) {
  const [messages, setMessages] = useState([]);

  return (
    <div className="chat">
      <ChatContext.Provider value={{ messages, setMessages }}>
        {children}
      </ChatContext.Provider>
    </div>
  );
}

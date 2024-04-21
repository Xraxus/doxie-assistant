import { createContext, useState } from "react";

export const ChatContext = createContext({});

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Hello! I'm Kamil's AI assistant. How can I help you today?",
    date: new Date(),
  },
];

export default function ({ children }) {
  const [messages, setMessages] = useState(initialMessages);

  return (
    <div className="chat">
      <ChatContext.Provider value={{ messages, setMessages }}>
        {children}
      </ChatContext.Provider>
    </div>
  );
}

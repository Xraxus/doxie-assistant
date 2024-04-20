import ChatMessage from "./ChatMessage";
import { ChatContext } from "./Chat";
import { useContext } from "react";

export default function ChatLog() {
  const chat = useContext(ChatContext);

  console.log(chat);

  const messagesList = chat.messages.length
    ? chat.messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))
    : "";

  return <div className="chat-log">
    {messagesList}
  </div>;
}

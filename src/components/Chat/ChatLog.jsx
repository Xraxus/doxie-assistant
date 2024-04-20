import ChatMessage from "./ChatMessage";
import { ChatContext } from "./Chat";
import { useContext } from "react";

export default function ChatLog() {
  const { messages } = useContext(ChatContext);

  const messagesList = messages.length
    ? messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))
    : "";

  return <div className="chat-log">{messagesList}</div>;
}
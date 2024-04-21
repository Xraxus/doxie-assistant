import ChatMessage from "./ChatMessage";
import { ChatContext } from "./Chat";
import { useContext, useEffect, useRef } from "react";

export default function ChatLog() {
  const { messages, isLoading } = useContext(ChatContext);
  const chatLogRef = useRef(null);
  useEffect(() => {
    chatLogRef.current.lastElementChild.scrollIntoView();
  }, [messages]);

  const messagesList = messages.length
    ? messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))
    : "";

  return (
    <div className="chat-log" ref={chatLogRef}>
      {messagesList}
      {isLoading && <div className="loader"></div>}
    </div>
  );
}

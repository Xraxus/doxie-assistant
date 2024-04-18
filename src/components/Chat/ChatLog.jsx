import ChatMessage from "./ChatMessage";

export default function ChatLog({ messages }) {
  return (
    <div className="chat-log">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </div>
  );
}

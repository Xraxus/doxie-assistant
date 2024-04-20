import { useState, useContext } from "react";
import { ChatContext } from "./Chat";

export default function ChatInput() {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, setMessages } = useContext(ChatContext);

  function formSubmit() {
    const newMessage = {
      text: inputMessage,
      role: "user",
      date: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    formSubmit();
  }

  return (
    <form
      className="chat-input"
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <textarea
        placeholder="What's happening?"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            formSubmit();
          }
        }}
        onChange={(e) => {
          setInputMessage(e.target.value);
        }}
        value={inputMessage}
      />
      <button type="submit">Ask</button>
    </form>
  );
}

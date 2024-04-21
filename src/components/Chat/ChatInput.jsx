import { useState, useContext } from "react";
import { ChatContext } from "./Chat";
import createNewMessage from "../../utils/createNewMessage";
import { getAssistantResponse } from "../../langchain";

export default function ChatInput() {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, setMessages } = useContext(ChatContext);

  function formSubmit() {
    const newMessage = createNewMessage(inputMessage, "user");

    setMessages([...messages, newMessage]);
    getAssistantResponse(newMessage.text);
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

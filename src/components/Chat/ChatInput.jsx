import { useState, useContext } from "react";
import { ChatContext } from "./Chat";
import createNewMessage from "../../utils/createNewMessage";
import { getAssistantResponse } from "../../langchain";

export default function ChatInput() {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, setMessages } = useContext(ChatContext);

  async function formSubmit() {
    const newMessage = createNewMessage(inputMessage, "user");

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");
    try {
      const assistantResponse = await fetch(
        "/.netlify/functions/assistantHandler",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userInput: newMessage,
            messagesHistory: messages,
          }),
        }
      ).then((response) => response.json());
      setMessages((prevMessages) => [
        ...prevMessages,
        createNewMessage(assistantResponse, "assistant"),
      ]);
    } catch (error) {
      console.error("Error fetching assistant response:", error);
    }
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

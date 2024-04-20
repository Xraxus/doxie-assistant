import Logo from "./components/Logo";
import Chat from "./components/Chat/Chat";
import ChatLog from "./components/Chat/ChatLog";
import ChatInput from "./components/Chat/ChatInput";

export default function App() {

  return (
    <>
      <Logo />
      <Chat>
        <ChatLog />
        <ChatInput />
      </Chat>
    </>
  );
}

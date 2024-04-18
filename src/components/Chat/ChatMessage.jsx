import userIcon from "../../assets/user-icon.png";
import assistantIcon from "../../assets/assistant-icon.png";

export default function ChatMessage({ message }) {
  const avatar = message.role === "user" ? userIcon : assistantIcon;

  const originalDate = new Date(message.date);
  const formattedDate = originalDate.toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const utilityClass = message.role === "user" ? "" : "assistant";

  return (
    <div className={`chat-message ${utilityClass}`}>
      <p className={`chat-message__date ${utilityClass}`}>{formattedDate}</p>
      <img src={avatar} alt={`${message.role} icon`} />
      <div className={`chat-message__text ${utilityClass}`}>
        <p>{message.text}</p>
      </div>
    </div>
  );
}

export default function formatConvHistory(messages) {
  return messages
    .map((message) => {
      return `${message.role}: ${message.text}`;
    })
    .join("\n");
}

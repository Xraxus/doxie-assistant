import { v4 as uuidv4 } from "uuid";

export default function createNewMessage(text, role) {
  return {
    id: uuidv4(),
    text,
    role,
    date: new Date().toISOString(),
  };
}

import { createChatBotMessage } from "react-chatbot-kit";
import BotAvatar from "./components/BotAvatar/BotAvatar";

const config = {
  botName: "GavinAI",
  initialMessages: [createChatBotMessage(`Hello world`)],
  customComponents: {
    botAvatar: (props) => <BotAvatar {...props} />,
  },
  customStyles: {
    // Override chatbot message styles
    botMessageBox: {
      backgroundColor: "purple",
    },
    // Override chat button styles
    chatButton: {
      backgroundColor: "purple",
    },
  },
};
export default config;

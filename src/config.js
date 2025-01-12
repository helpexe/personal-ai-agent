import { createChatBotMessage } from "react-chatbot-kit";
import BotAvatar from "./components/BotAvatar/BotAvatar";

const config = {
  botName: "GavinAI",
  initialMessages: [createChatBotMessage(`Hi there! I'm GavinAI, and I'd be more than happy to tell you about Gavin and why he'd be a great fit at FutureMakers.`)],
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
  state: {
    messages: [],
  }
};
export default config;

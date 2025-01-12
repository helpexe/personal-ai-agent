import { createChatBotMessage } from "react-chatbot-kit";
import BotAvatar from "./components/BotAvatar/BotAvatar";

const config = {
  botName: "GavinAI",
  initialMessages: [
    // createChatBotMessage(
    //   `Hi there! I'm GavinAI, and I'd be more than happy to tell you about Gavin and why he'd be a great fit at FutureMakers.`
    // ),
    createChatBotMessage(
      "Hi, I'm GavinAI! I'd love to tell you about Gavin and his background. Would you like to know more about his background?"
    ),
  ],
  customComponents: {
    botAvatar: (props) => <BotAvatar {...props} />,
  },
  customStyles: {
    // Override chatbot message styles
    botMessageBox: {
      backgroundColor: "#e0e0e0",
    },

    // Override chat button styles
    chatButton: {
      backgroundColor: "purple",
    },
  },
  state: {
    // messages: [],
    chatContext: [],
  },
};
export default config;

import { createChatBotMessage } from "react-chatbot-kit";
import BotAvatar from "./components/BotAvatar/BotAvatar";
import Todos from "./components/Todos/Todos";
import Options from "./components/Options/Options";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";

const config = {
  botName: "GavinAI",
  initialMessages: [
    createChatBotMessage(`Hello world`, {
      widget: "options",
    }),
  ],
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
    // THIS WAS FOR LEARNING WIDGETS
    todos: [],
  },
  widgets: [
    {
      widgetName: "todos",
      widgetFunc: (props) => <Todos {...props} />,
      mapStateToProps: ["todos"],
    },
    {
      widgetName: "options",
      widgetFunc: (props) => <Options {...props} />,
    },
    {
      widgetName: "javascriptQuiz",
      widgetFunc: (props) => <Quiz {...props} />,
      props: {
        questions: [
          {
            question: "What is closure?",
            answer:
              "Closure is a way for a function to retain access to it's enclosing function scope after the execution of that function is finished.",
            id: 1,
          },
          {
            question: "Explain prototypal inheritance",
            answer:
              "Prototypal inheritance is a link between an object and an object store that holds shared properties. If a property is not found on the host object, javascript will check the prototype object.",
            id: 2,
          },
        ],
      },
    },
  ],
  actionProvider: ActionProvider,
  messageParser: MessageParser
};
export default config;

import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";
import Chatbot from "react-chatbot-kit";
import "./App.css";
import "react-chatbot-kit/build/main.css";
import React from "react";

function App() {
  // Function to save messages
  const saveMessages = (messages, HTMLString) => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  };

  // Function to load messages
  const loadMessages = () => {
    const messages = JSON.parse(localStorage.getItem("chat_messages"));
    return messages;
  };

  const saveChatContext = (context) => {
    localStorage.setItem("chat_context", JSON.stringify(context));
  };

  const loadChatContext = () => {
    const context = JSON.parse(localStorage.getItem("chat_context"));
    return context || [];
  };

  // Function to load messages
  return (
    <div id="main-container">
      <Chatbot
        config={{
          ...config,
          state: {
            chatContext: loadChatContext(),
          },
        }}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        headerText="GavinAI"
        placeholderText="Message GavinAI"
        messageHistory={loadMessages()}
        saveMessages={saveMessages}
      />
    </div>
  );
}

export default App;

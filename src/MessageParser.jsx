/* eslint-disable */
import React from "react";

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    const lowercase = message.toLowerCase();
    // console.log(message);
    // if (lowercase.includes("hello")) {
    //   actions.handleHelloWorld();
    // }

    // if (lowercase.includes("todos")) {
    //   actions.handleTodos();
    // }

    // if (lowercase.includes("chatgpt")) {
    //   actions.handleChatGPTMessage(message);
    // }

    // actions.handleChatGPTMessage(message);
    // actions.handleHelloWorld(message);
    actions.handleChatGPTMessage(message);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};

export default MessageParser;

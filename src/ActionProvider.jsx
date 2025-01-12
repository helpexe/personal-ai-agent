/* eslint-disable */

import React from "react";
const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  // Example handler
  const handleHelloWorld = () => {
    const message = createChatBotMessage("Hi there!");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  const handleTodos = () => {
    const message = createChatBotMessage("Sure! Here's your todos.", {
      widget: "todos",
    });

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  const handleJavascriptQuiz = () => {
    console.log("HELP");
    const message = createChatBotMessage(
      "Fantastic. Here is your quiz. Good luck!",
      {
        widget: "javascriptQuiz",
      }
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  return (
    <div>
      {" "}
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHelloWorld,
            handleTodos,
            handleJavascriptQuiz,
          },
        });
      })}{" "}
    </div>
  );
};
export default ActionProvider;

/* eslint-disable */
import OpenAI from "openai";
import React from "react";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const MAX_MESSAGES = 20;
  const systemInfo = {
    role: "system",
    content:
      "You are a chatbot named GavinAI designed to tell an employer from FutureMakers about Gavin. Gavin is a 20-year-old computer science major (junior year) at the University of Maryland, College Park with a specialization in machine learning. Try to prioritize short responses. Please refer to yourself as GavinAI.",
  };

  const saveMessages = (messages) => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  };

  const saveChatContext = (context) => {
    localStorage.setItem("chat_context", JSON.stringify(context));
  };

  const truncateMessages = (context) => {};

  const openai = new OpenAI({
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Example handler
  const handleHelloWorld = () => {
    const message = createChatBotMessage("Hi there!");

    setState((prev) => {
      const updatedMessages = [...prev.messages, message];
      saveMessages(updatedMessages);
      return {
        ...prev,
        messages: [...prev.messages, message],
      };
    });
  };

  const handleChatGPTMessage = async (userMessage) => {
    try {
      // Add the new user message to state first
      // let conversationHistory;

      // setState((prev) => {
      //   conversationHistory = [
      //     ...prev.messages,
      //     { role: "user", content: userMessage },
      //   ];
      //   return {
      //     ...prev,
      //     messages: conversationHistory,
      //   };
      // });

      // Add user message to convo history

      // console.log(
      //   `The chilren: ${children.props.children.props.state.chatContext}`
      // );
      // console.log(children.props.children.props.state.chatContext);

      let updatedContext = [
        ...children.props.children.props.state.chatContext,
        { role: "user", content: userMessage },
      ];

      console.log(`updatedContext is`);
      console.log(updatedContext);
      setState((prevState) => {
        return {
          ...prevState,
          chatContext: updatedContext,
        };
      });

      // console.log("History");
      // console.log(conversationHistory);

      // Get ChatGPT response
      // console.log(`updatedContext: ${updatedContext}`);
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [systemInfo, ...updatedContext],
      });

      const gptMessage = chatCompletion.choices[0].message.content;

      // const gptMessage = "Kanye";

      // Create chatbot message w/ChatGPT's response and add to the state
      const message = createChatBotMessage(gptMessage);

      // setState((prev) => ({
      //   ...prev,
      //   messages: [
      //     ...prev.messages,
      //     {
      //       role: "assistant",
      //       content: gptMessage,
      //     },
      //   ],
      // }));

      setState((prev) => {
        // console.log([
        //   ...prev.chatContext,
        //   {
        //     role: "assistant",
        //     content: gptMessage,
        //   },
        // ]);
        const updatedMessages = [...prev.messages, message];
        const updatedContext = [
          ...prev.chatContext,
          {
            role: "assistant",
            content: gptMessage,
          },
        ];
        saveMessages(updatedMessages);
        saveChatContext(updatedContext);
        return {
          ...prev,
          messages: updatedMessages,
          chatContext: updatedContext,
        };
      });

      // setState((prev) => ({
      //   ...prev,
      //   messages: [...prev.messages, message],
      // }));
    } catch (e) {
      console.error("Error communicating with OpenAI:", e);

      // Send error message to user.
      const errMessage = createChatBotMessage(
        "Something went wrong with talking to ChatGPT :("
      );
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, errMessage],
      }));
    }
  };

  return (
    <div>
      {" "}
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHelloWorld,
            handleChatGPTMessage,
          },
        });
      })}{" "}
    </div>
  );
};
export default ActionProvider;

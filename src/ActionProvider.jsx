/* eslint-disable */
import OpenAI from "openai";
import React from "react";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const openai = new OpenAI({
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Example handler
  const handleHelloWorld = () => {
    const message = createChatBotMessage("Hi there!");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  const handleChatGPTMessage = async (userMessage) => {
    try {
      // Add the new user message to state first
      let conversationHistory;

      setState((prev) => {
        conversationHistory = [
          ...prev.messages,
          { role: "user", content: userMessage },
        ];
        return {
          ...prev,
          messages: conversationHistory,
        };
      });

      // setState((prev) => ({
      //   ...prev,
      //   messages: [...prev.messages, { role: "user", content: userMessage }],
      // }));

      // Retrieve the updated conversation history from state
      // let conversationHistory;
      // setState((prev) => {
      //   conversationHistory = prev.messages;
      //   return prev;
      // });

      const allMessages = [
        {
          role: "system",
          content:
            "You are a chatbot named GavinAI designed to tell an employer from FutureMakers about Gavin. Gavin is a 20-year-old computer science major (junior year) at the University of Maryland, Collegeg Park with a specialization in machine learning. ",
        },
        ...conversationHistory
      ];

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: allMessages,
      });

      // Extract response from GPT
      const gptMessage = chatCompletion.choices[0].message.content;

      // Create chatbot message w/ChatGPT's response and add to the state
      const message = createChatBotMessage(gptMessage);

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages,
          {
            role: 'assistant',
            content: gptMessage
          }
        ]
      }));
      
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));


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

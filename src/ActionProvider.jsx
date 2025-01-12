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
      console.log("HELLO?????")
      console.log(`updatedContext: ${JSON.stringify(updatedContext)}`);
      setState((prevState) => {
        return {
          ...prevState,
          chatContext: updatedContext,
        };
      });

      // console.log("History");
      // console.log(conversationHistory);

      // Get ChatGPT response
      console.log(`updatedContext: ${updatedContext}`);
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: updatedContext,
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
        return {
          ...prev,
          messages: [...prev.messages, message],
          chatContext: [
            ...prev.chatContext,
            {
              role: "assistant",
              content: gptMessage,
            },
          ],
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

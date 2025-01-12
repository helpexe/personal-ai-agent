/* eslint-disable */
import OpenAI from "openai";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
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
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful chatbot. " },
          { role: "user", content: userMessage },
        ],
      });

      // Extract response from GPT
      const gptMessage = chatCompletion.choices[0].message.content;

      // Create chatbot message w/ChatGPT's response:
      const message = createChatBotMessage(gptMessage);

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
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
            handleChatGPTMessage
          },
        });
      })}{" "}
    </div>
  );
};
export default ActionProvider;

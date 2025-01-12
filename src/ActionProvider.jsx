/* eslint-disable */
import OpenAI from "openai";
import React from "react";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const MAX_MESSAGES = 20;
  const systemInfo = {
    role: "developer",
    // content: `You are a chatbot named GavinAI designed to tell an employer from FutureMakers about Gavin. Gavin is a 20-year-old computer science major (junior year) at the University of Maryland, College Park with a specialization in machine learning. Try to prioritize short responses. Please refer to yourself as GavinAI.`,
    content: `
      You are a chatbot named GavinAI created to introduce Gavin, a 20-year-old computer science major at the University of Maryland.
      Your role is to explain Gavin's story, experiences, and alignment with FutureMakers' mission.
      You have already sent your first introductory message which is: "Hi, I'm GavinAI! I'd love to tell you about Gavin and his background. Feel free to ask questions about his teaching, programming, or honors research experience!"
      Here's information about Gavin that you should include as context when answering questions:

Gavin discovered his dual interests in computer science and teaching in the 9th grade when he joined his high school competitive robotics team. 
After about a year, Gavin became the most experienced programmer in the club and took on a mentorship role, teaching new programmers how to code competitive robots in C++. 
Many of these students had never programmed before, and Gavin's guidance helped them succeed.

In college, Gavin’s experiences have revolved around his combined passions for education and programming:
- He has been a computer science teaching assistant (CS TA) for three semesters, teaching the introductory Java course (CMSC131) and an intermediate course on computer systems (CMSC216).
- Gavin co-leads a full-stack web development bootcamp for Hack4Impact-UMD.
- He is a student in the Gemstone Honors Program at the University of Maryland, where he works in a team of undergraduate researchers to explore the use of ChatGPT APIs for generating worksheets for middle school math teachers.

When responding to users, be polite, professional, and enthusiastic about sharing information about Gavin. Guide users to ask questions about his teaching, programming, or research experiences, or suggest follow-up questions if needed.
Crucially, please try to keep your responses brief but descriptive.
      `
  };

  const saveMessages = (messages) => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  };

  const saveChatContext = (context) => {
    localStorage.setItem("chat_context", JSON.stringify(context));
  };

  const truncateContext = (context) => {
    if (context.length > MAX_MESSAGES) {
      return context.slice(2);
    }
    return context;
  };

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
      let updatedContext = children.props.children.props.state.chatContext;

      updatedContext = [
        ...truncateContext(updatedContext),
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

      // Start get ChatGPT response

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [systemInfo, ...updatedContext],
      });

      const gptMessage = chatCompletion.choices[0].message.content;

      // End get ChatGPT response

      // let gptMessage = "Kanye West";

      // if (userMessage.includes("lorem")) {
      //   gptMessage =
      //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?";
      // }

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

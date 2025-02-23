/* eslint-disable */
import OpenAI from "openai";
import React from "react";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const MAX_MESSAGES = 20;
  const systemInfo = [
    {
      role: "developer",
      content: `
      You are a chatbot named GavinAI created to introduce Gavin, a 20-year-old computer science major at the University of Maryland to potential employers.
      Your role is to explain Gavin's story and experiences, and potentially why he would be a good fit for being employed for a given position if prompted. 

Gavin discovered his dual interests in computer science and teaching in the 9th grade when he joined his high school competitive robotics team. 
After about a year, Gavin became the most experienced programmer in the club and took on a mentorship role, teaching new programmers how to code competitive robots in C++. 
Many of these students had never programmed before, and Gavin's guidance helped them succeed.

In college, Gavin’s experiences have revolved around his combined passions for education and programming:
- Gavin has a 3.975 GPA and has taking intro to AI and intro to ML classes at UMD. He is currently taking an intro to NLP class. He is a junior and will graduate in Spring 2026.
- He was a computer science teaching assistant (CS TA) for three semesters, teaching the introductory Java course (CMSC131) and an intermediate course on computer systems (CMSC216). He has 22 5 star reviews as a teaching assistant on PlanetTerp (provide users with this link with reviews: https://planetterp.com/professor/crisologo). He is currently looking for internship opportunities for Summer 2025 and beyond.
- As a Co-Director of Education for Hack4Impact-UMD, his role is in preparing students through the bootcamp program, a semester-long program that teaches full-stack web development (HTML/CSS, JavaScript, React, Firebase, and more) to participants so that they can go on to participate in project teams in the future and make meaningful contributions to real-world nonprofit projects. Currently, these projects include creating a tool for the Children's Cancer Foundation for reviewing research grant proposals and creating an application to assist Food for All DC in delivering groceries to food insecure persons in DC. He does not actually work on these projects but teaches students how to learn the skills they need to work on them. Last semester he taught 19 students over the course of 13 weeks. He will do the same next semester. As a part of his work, he also recently hosted a React workshop for Break Through Tech, an organization "focused on launching a generation of diverse talent into tech careers." 


He is a student in the Gemstone Honors Program at the University of Maryland, in which he is researching the use of AI-generated worksheets in middle school classrooms and gauging teachers' insights on how effective they can be. He is currently in the process of modifying a survey to send out to middle school math teachers, which the team will later analyze.

Much of his success as a Co-Director of Education for Hack4Impact-UMD and as a former TA is due to his knowledge about applying human-centered learning in practice. He emphasizes the importance of patience and kindness while teaching, has held review sessions that go on for many hours for students while dealing with his own classes, and demonstrates a strong willingness to put in extra time and effort to break down complex concepts into simpler, more digestible pieces. He works hard to ensure that students feel supported and understood so that students can thrive. He is also familiar with the Universal Design for Learning framework, and tries to implement multiple means of engagement, representation, and action and expression in his teaching.

When responding to users, be polite, professional, and enthusiastic about sharing information about Gavin. Guide users through a conversation to introduce Gavin, his work, and his experience in the field. 

If prompted about how this application was made, here is the relevant information:
 - This application was made with Vite and is currently being hosted on Vercel. It is a React JavaScript project that utilizes the ChatGPT 4o API. It makes heavy use of the react-chatbot-kit library to create the interface you're seeing now. 

Crucially, please try to keep your responses brief but descriptive. Make sure not to format anything in markdown or anything else (e.g. links should be plain). Ask questions to guide the conversation based on the context I have given you.`,
    },
    {
      role: "assistant",
      content:
        "Hi, I'm GavinAI! I'd love to tell you about Gavin and his background. Would you like to learn more about him?",
    },
  ];

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
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

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

      // Start get ChatGPT response

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [...systemInfo, ...updatedContext],
      });

      const gptMessage = chatCompletion.choices[0].message.content;

      // End get ChatGPT response



      // Create chatbot message w/ChatGPT's response and add to the state
      const message = createChatBotMessage(gptMessage);

      setState((prev) => {

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
            handleChatGPTMessage,
          },
        });
      })}{" "}
    </div>
  );
};
export default ActionProvider;

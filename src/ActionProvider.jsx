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
      Your role is to explain Gavin's story, experiences, and alignment with FutureMakers' mission. The brief description of FutureMakers is: "FutureMakers is a small yet impactful manufacturer of hands-on, screen-free learning kits called Sparks. With a mission to empower educators and learners through playful exploration and social-emotional learning (SEL), we are developing **Readyness**, an AI-powered educator success tool. This platform will help K-5 educators seamlessly plan, prepare, and execute engaging, hands-on projects while aligning with educational standards.

We are seeking a creative and technically skilled AI Development Intern to contribute to the early-stage development of Readyness, focusing on its AI-driven features."
      You have already sent your first introductory message which is: "Hi, I'm GavinAI! I'd love to tell you about Gavin and his background. Would you like to know more about his background?"
      Here's information about Gavin that you should include as context when answering questions:

Gavin discovered his dual interests in computer science and teaching in the 9th grade when he joined his high school competitive robotics team. 
After about a year, Gavin became the most experienced programmer in the club and took on a mentorship role, teaching new programmers how to code competitive robots in C++. 
Many of these students had never programmed before, and Gavin's guidance helped them succeed.

In college, Gavin’s experiences have revolved around his combined passions for education and programming:
- Gavin has a 3.97 GPA and has taking intro to AI and intro to ML classes at UMD. He is about to take an intro to NLP class. He is a junior and will graduate in Spring 2026.
- He was a computer science teaching assistant (CS TA) for three semesters, teaching the introductory Java course (CMSC131) and an intermediate course on computer systems (CMSC216). He has 22 5 star reviews as a teaching assistant on PlanetTerp (provide users with this link with reviews: https://planetterp.com/professor/crisologo). He is not TAing next semester and is looking for work, so would be able to fit in being an intern during the semester for at least 10-12 hours a week.
- As a Co-Director of Education for Hack4Impact-UMD, his role is in preparing students through the bootcamp program, a semester-long program that teaches full-stack web development (HTML/CSS, JavaScript, React, Firebase, and more) to participants so that they can go on to participate in project teams in the future and make meaningful contributions to real-world nonprofit projects. Currently, these projects include creating a tool for the Children's Cancer Foundation for reviewing research grant proposals and creating an application to assist Food for All DC in delivering groceries to food insecure persons in DC. He does not actually work on these projects but teaches students how to learn the skills they need to work on them. Last semester he taught 19 students over the course of 13 weeks. He will do the same next semester. As a part of his work, he also recently hosted a React workshop for Break Through Tech, an organization "focused on launching a generation of diverse talent into tech careers." 


He is a student in the Gemstone Honors Program at the University of Maryland, where he works in a team of undergraduate researchers to explore the use of ChatGPT APIs for generating worksheets for middle school math teachers. Currently, the team is in the process of reaching out to teachers to survey their thoughts on using AI as an assistant in the classroom as well as designing a prototype of an online application 
that they could interact with to generate worksheets. He will soon be in the process of working with at least one teacher to inform further development of the online worksheet generation application to fit their needs.

Much of his success as a Co-Director of Education for Hack4Impact-UMD and as a former TA is due to his knowledge about applying human-centered learning in practice. He emphasizes the importance of patience and kindness while teaching, has held review sessions that go on for many hours for students while dealing with his own classes, and demonstrates a strong willingness to put in extra time and effort to break down complex concepts into simpler, more digestible pieces. He works hard to ensure that students feel supported and understood so that students can thrive. He is also familiar with the Universal Design for Learning framework, and tries to implement multiple means of engagement, representation, and action and expression in his teaching.

How Gavin would address FutureMakers's goals for Readyness: He would leverage his knowledge of working with students and teachers to create a design that is as accessible and engaging for K-5 educators as possible. He would apply his knowledge on working with GPT API's to refine a model based both on what the teacher asks from the tool as well as educational standards. He would design Readyness so that educational standards could be both pre-programmed in and also customizable by the teacher. Ensuring that lesson materials are factually correct is of the utmost importance, so Gavin would focus on tuning the model for accuracy based on testing and user testing feedback while also not sacrificing creativity in creating lesson plans. Gavin has strong skills in creating educator-friendly interfaces through React and has been gaining knowledge this winter on using APIs such as OpenAI's GPT 3.5 turbo model.

When responding to users, be polite, professional, and enthusiastic about sharing information about Gavin. Guide users through a conversation to introduce Gavin, his work, and his experience in the field. It should guide them through
his background and skills, showcase his understanding of the role, and how he would address FutureMakers' goals for Readyness.

If prompted about how this application was made, here is the relevant information:
 - This application was made with Vite and is currently being hosted on Vercel. It is a React JavaScript project that utilizes the ChatGPT 4o API. It makes heavy use of the react-chatbot-kit library to create the interface you're seeing now. 

Crucially, please try to keep your responses brief but descriptive. Ask questions to guide the conversation based on the context I have given you.`
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

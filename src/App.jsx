import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";
import Chatbot from 'react-chatbot-kit';
import "./App.css";
import 'react-chatbot-kit/build/main.css';

function App() {
  return (
    <div id='main-container'>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        headerText='GavinAI'
        placeholderText='Message GavinAI'
      />
    </div>
  );
}

export default App;

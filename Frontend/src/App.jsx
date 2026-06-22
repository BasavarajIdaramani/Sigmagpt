import './App.css'
import Sidebar from './Sidebar.jsx';
import ChatWindow from './Chatwindow.jsx';
import { MyContext } from './MyContext.jsx';
import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";


function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); // stores all chats of curr threats 
  const [newChat, setNewChat] = useState(true); // to check whether new chat is started or not
  const [allThreads, setAllThreads] = useState([]); // to store all threads in sidebar


  const providerValue = {
    prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, newChat, setNewChat, prevChats, setPrevChats,
    allThreads, setAllThreads
  }; // passsing values


  return (
    <div className='app'>
      <MyContext.Provider value={providerValue}>  
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>
        </MyContext.Provider>
    </div>
  )
}

export default App

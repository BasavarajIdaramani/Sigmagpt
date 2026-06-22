import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:2000/api/threads");
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            
           
            //console.log(filteredData);
            setAllThreads(filteredData);
            
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try{
            const response = await fetch(`http://localhost:2000/api/threads/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        }catch(err){
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:2000/api/threads/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);
                
            //updated ythreads after deletion
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }
            
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className="sidebar">
          
             <button onClick={createNewChat}>
                 <img src="/blacklogo.png" alt="gpt logo" className="logo"/>
                 <span><i className="fa-solid fa-pen-to-square"></i></span>
             </button>

       
              
              <ul className="history">
                  {
                    allThreads?.map((thread, index) => (
                        <li key={index}
                        onClick={(e) => changeThread(thread.threadId)}
                        className={currThreadId === thread.threadId ? "highlighted" : ""}

                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); // stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                  }
              </ul>


             
                <div className="sign">
                    <p>By Basavraj I</p>
                </div>
            
        </section>
    )
}



export default Sidebar;
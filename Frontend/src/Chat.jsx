import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

//react-markdown 


function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);
    
    useEffect(() => {
        if (reply === null) {
            setLatestReply(null);
            return;
        }
        if (!prevChats?.length) return;

        const content = reply.split(" ");

        let index = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, index + 1).join(" "));
            index++;
            if (index >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);
    }, [prevChats, reply]);

    return (
        <div className="chats">
           {newChat && <h1 style={{marginTop: "auto", marginBottom: "auto"}}>Start a New Chat</h1>}
           {prevChats?.slice(0, -1).map((chat, index) => 
                <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={index}>
                    {chat.role === "user" ? 
                        <p className="userMessage">{chat.content}</p> : 
                        <div className="gptMessage">
                            <ReactMarkdown
                                rehypePlugins={[rehypeHighlight]}
                                components={{
                                    p: ({ node, ...props }) => (
                                        <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6 }} {...props} />
                                    ),
                                }}
                            >
                                {chat.content}
                            </ReactMarkdown>
                        </div>
                    }
                </div>
            )}

            {
                prevChats.length > 0 && (
                  <>
                     {
                         latestReply === null ? (
                              <div className="gptDiv" key={"non-typing"}>
                                  <div className="gptMessage">
                                      <ReactMarkdown
                                          rehypePlugins={[rehypeHighlight]}
                                          components={{
                                              p: ({ node, ...props }) => (
                                                  <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6 }} {...props} />
                                              ),
                                          }}
                                      >
                                          {prevChats[prevChats.length-1].content}
                                      </ReactMarkdown>
                                  </div>
                              </div>
                        ) : (
                          <div className="gptDiv" key={"typing"}>
                              <div className="gptMessage">
                                  <ReactMarkdown
                                        rehypePlugins={[rehypeHighlight]}
                                        components={{
                                            p: ({ node, ...props }) => (
                                                <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6 }} {...props} />
                                            ),
                                        }}
                                    >
                                        {latestReply}
                                    </ReactMarkdown>
                              </div>
                        </div>  
                        )
                         
                     }
                  </>

                )
            }

            

        </div>
    )
}

export default Chat;
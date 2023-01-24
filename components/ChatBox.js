import { useEffect, useState } from "react";
import classes from "../styles/ChatBox.module.scss";
import ScrollToBottom from "react-scroll-to-bottom";

function ChatBox({ socket, partner }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const sendMessage = async (e) => {
    if (currentMessage !== "") {
      const messageData = {
        partner: partner,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        side: "left",
      };
      await socket.emit("send message", messageData);
      messageData.side = "right";
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };
  useEffect(() => {
    socket.on("recieve message", (message) => {
      return setMessageList((list) => [...list, message]);
    });
    return function cleanup() {
      socket.removeListener("recieve message");
    };
  }, []);
  return (
    <div className={classes.chatContainer}>
      <div className={classes.overFlow}>
        <ScrollToBottom className={classes.chatBody}>
          {messageList.map((message, index) => {
            return (
              <div key={index} className={classes.chatLine} id={message.side}>
                <div className={classes.messageContainer}>
                  <h1>{message.message}</h1>
                  <p>{message.time}</p>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className={classes.chatFooter}>
        <input
          type="text"
          value={currentMessage}
          placeholder="Type here..."
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;

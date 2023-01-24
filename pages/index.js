import { useEffect, useState } from "react";
import classes from "../styles/Home.module.scss";
import io from "socket.io-client";
import ChatBox from "@/components/ChatBox";
import Head from "next/head";

const endpoint = "https://blind-chat-backend.onrender.com";
const socket = io(endpoint, { autoConnect: false });

export default function Home() {
  const [partner, setPartner] = useState(null);
  const [state, setState] = useState("Ideal");
  useEffect(() => {
    socket.connect();
  }, []);
  socket.on("make connection", (other) => {
    setPartner(other);
    setState("Connected");
    socket.emit("lets chat", other);
  });
  socket.on("hi", (data) => {
    setPartner(data);
    setState("Connected");
  });
  socket.on("remove me", (data) => {
    if (data === partner) {
      socket.emit("change my status");
      setPartner(null);
      setState("Ideal");
    }
  });
  const joinHandler = (e) => {
    e.preventDefault();
    setState("Waiting");
    socket.emit("change my status");
    socket.emit("join");
  };
  const leaveHandler = (e) => {
    e.preventDefault();
    socket.emit("home", partner);
    socket.emit("change my status");
    setState("Ideal");
    setPartner(null);
  };
  return (
    <>
      <Head>
        <title>Blind Chat - {state}</title>
      </Head>
      <div className={classes.container}>
        <div className={classes.dashboard}>
          <div className={classes.topContainer}>
            <h2 className={classes.state} id={state}>
              {state}
            </h2>
            {partner && (
              <button className={classes.buttonTwo} onClick={leaveHandler}>
                Leave chat
              </button>
            )}
          </div>
          {partner && <ChatBox socket={socket} partner={partner} />}
          <div className={classes.buttonContainer}>
            {state === "Ideal" && (
              <button className={classes.buttonOne} onClick={joinHandler}>
                Join
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

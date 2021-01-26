import React from "react";
import { useRef, useEffect, useState } from "react";
import * as p2p from "./p2p.js";

export function Chat(props) {
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState("");

  function onSendMessage() {
    p2p.sendMessage(props.connRef.current, chatMessage);
    newMessage(chatMessage);
    setChatMessage("");
  }

  function newMessage(m) {
    setMessages((oldm) => {
      if (oldm === "") return m;
      return m + "\n" + oldm;
    });
  }

  useEffect(() => {
    props.connRef.current.onMessage = (m) => newMessage(m.message);
    return () => {
      props.connRef.current.onMessage = null;
    };
  }, [props.connRef]);

  return (
    <div>
      <input
        type="text"
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
        onKeyUp={(e) => (e.key === "Enter" ? onSendMessage() : 0)}
      ></input>
      <button onClick={onSendMessage}>Send message</button>
      <p style={{ whiteSpace: "pre-line" }}>{messages}</p>
    </div>
  );
}

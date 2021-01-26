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
    const indx = p2p.addMessageHandler(props.connRef.current, (m) => {
      if (m.type === "message") return newMessage(m.message);
      newMessage(JSON.stringify(m));
    });
    return () => {
      p2p.removeMessageHandler(props.connRef.current, indx);
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

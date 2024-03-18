import React, { useState } from "react";
import styles from "./ChatInterface.module.scss";
import { getChatGPTResponse, getDalleResponse } from "../api/getChatResponse";

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = inputText.trim();
    if (!userMessage) return;
    //triggers
    const imageRequestTriggers = [
      "create image",
      "picture of",
      "generate picture",
      "show me an image",
    ];
    const isImageRequest = imageRequestTriggers.some((trigger) =>
      userMessage.toLowerCase().includes(trigger)
    );

    setMessages((messages) => [
      ...messages,
      { sender: "user", text: userMessage, imageUrl: null },
    ]);
    setInputText("");

    if (isImageRequest) {
      const imageResponse = await getDalleResponse(userMessage);
      if (imageResponse) {
        setMessages((messages) => [
          ...messages,
          { sender: "ai", text: "", imageUrl: imageResponse },
        ]);
      }
    } else {
      const chatResponse = await getChatGPTResponse(userMessage);
      if (chatResponse) {
        setMessages((messages) => [
          ...messages,
          { sender: "ai", text: chatResponse, imageUrl: null },
        ]);
      }
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.chatArea}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${styles[message.sender]}`}
          >
            {message.text}
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="Generated Content"
                style={{ maxWidth: "100%", borderRadius: "10px" }}
              />
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          className={styles.textarea}
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your message here..."
        />
        {/* <button type="submit" className={styles.button}>
                  Send
                </button>*/}
      </form>
    </div>
  );
}

export default ChatInterface;

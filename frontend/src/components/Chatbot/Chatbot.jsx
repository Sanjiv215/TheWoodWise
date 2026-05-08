import { useEffect, useRef, useState } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", msg: "Hi! I am your WoodWise support assistant.", time: "Now" }
  ]);
  const messagesEnd = useRef(null);

  useEffect(() => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typing]);

  function getBotReply(userText) {
    const lowerText = userText.toLowerCase();
    if (lowerText.includes("delivery")) return "Delivery usually takes 4 to 6 days after checkout.";
    if (lowerText.includes("sofa")) return "Our Royal Velvet Sofa is a customer favourite for living rooms.";
    if (lowerText.includes("price")) return "You can use the price filter on the products page.";
    if (lowerText.includes("office")) return "The Ergo Office Chair and Executive Work Desk are great for workspaces.";
    return "Nice question! You can explore sofas, chairs, beds, lamps and office furniture in our collection.";
  }

  function sendMessage() {
    if (text.trim() === "") return;

    const userMessage = {
      from: "user",
      msg: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const userText = text;
    setMessages([...messages, userMessage]);
    setText("");
    setTyping(true);

    setTimeout(() => {
      const botMessage = {
        from: "bot",
        msg: getBotReply(userText),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((oldMessages) => [...oldMessages, botMessage]);
      setTyping(false);
    }, 800);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <div>
      <button className="chat-button" onClick={() => setOpen(!open)}>☰</button>
      {open && (
        <div className="chat-box">
          <div className="chat-header">
            <div className="bot-avatar">W</div>
            <div>
              <h3>WoodWise Support</h3>
              <p>Usually replies instantly</p>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>×</button>
          </div>

          <div className="chat-messages">
            {messages.map((item, index) => (
              <div key={index} className={item.from === "bot" ? "message-row bot-row" : "message-row user-row"}>
                <div className="message-avatar">{item.from === "bot" ? "W" : "U"}</div>
                <div className={item.from === "bot" ? "bot-msg" : "user-msg"}>
                  <p>{item.msg}</p>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="message-row bot-row">
                <div className="message-avatar">W</div>
                <div className="typing-bubble"><span></span><span></span><span></span></div>
              </div>
            )}
            <div ref={messagesEnd}></div>
          </div>

          <div className="chat-input">
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type and press Enter..." />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;

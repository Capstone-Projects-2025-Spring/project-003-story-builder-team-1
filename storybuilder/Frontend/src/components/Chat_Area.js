import React, { useState } from 'react';

function Chat_Area({ messages}) {
    console.log('Messages in Chat_Area:', messages);
    return (
        <div className="chats">
          {messages.map((message, i) => 
            <div key={i} className={message.is_ai ? "chat ai" : "chat"}>
              <img className="chat-icons" src={message.is_ai ? "/ai-icon.png" : "/user-icon.png"} alt="AI"/><p className="txt">{message.text}</p>
            </div>
          )}
        </div>
    );
}

export default Chat_Area;
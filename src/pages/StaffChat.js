import React, { useState } from 'react';

const StaffChat = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    setError(null);

    const userMessage = { text: message, sender: 'staff', time: new Date().toLocaleTimeString() };
    setChatMessages((prev) => [...prev, userMessage]);
    setMessage('');

    try {
      const response = await fetch('https://your-backend-api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      const data = await response.json();
      const botReply = { text: data.reply, sender: 'bot', time: new Date().toLocaleTimeString() };
      setChatMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setError('Error sending message. Please try again.');
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Chat with Users</h1>
      <div className="h-64 overflow-y-auto border p-4 mb-2 bg-gray-100">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'staff' ? 'text-right' : 'text-left'}`}>
            <span className={`p-2 rounded-lg ${msg.sender === 'staff' ? 'bg-blue-200' : 'bg-gray-200'}`}>
              {msg.text} <small className="text-gray-500">({msg.time})</small>
            </span>
          </div>
        ))}
      </div>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSending}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700"
          disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default StaffChat;